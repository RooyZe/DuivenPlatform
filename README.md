# Security Mitigatie - DuivenPlatform

## Threat Model Mitigatie

### Threat ID 37: Potential SQL Injection Vulnerability

**STRIDE Category:** Tampering  
**Interaction:** SQL query  
**Priority:** High  
**Beschrijving:** Kwaadaardige invoer kan worden gebruikt om SQL-queries richting de MySQL-database te manipuleren.

---

## Geïmplementeerde Mitigatie

### 1. Entity Framework Core met Parameterized Queries

**Wat is aangepast:**
- Alle database-interacties in `PigeonService.cs` en `OrderService.cs` gebruiken Entity Framework Core
- EF Core genereert **automatisch parameterized queries** voor alle LINQ-operaties
- Geen enkele plek in de code gebruikt raw SQL queries (`FromSqlRaw` of `ExecuteSqlRaw`)

**Hoe dit SQL Injection voorkomt:**
- Gebruikersinvoer wordt **nooit** direct in SQL-statements geplaatst
- Alle parameters worden door EF Core veilig ge-escaped
- De database-driver behandelt invoer als data, niet als executable code

### 2. Code Voorbeelden

#### VEILIG: PigeonService.GetByIdAsync()
```csharp
// SECURITY: .FirstOrDefaultAsync() gebruikt parameterized queries
public async Task<Pigeon?> GetByIdAsync(int id)
{
	return await _context.Pigeons
		.AsNoTracking()
		.FirstOrDefaultAsync(p => p.Id == id);
}
```

**Gegenereerde SQL (veilig):**
```sql
SELECT * FROM Pigeons WHERE Id = @p0
-- Parameter @p0 = 5 (ge-escaped door EF Core)
```

#### VEILIG: PigeonService.GetAllAsync()
```csharp
// SECURITY: .Where() en .ToListAsync() gebruiken parameterized queries
public async Task<List<Pigeon>> GetAllAsync()
{
	return await _context.Pigeons
		.Where(p => !p.IsSold)
		.AsNoTracking()
		.ToListAsync();
}
```

**Gegenereerde SQL (veilig):**
```sql
SELECT * FROM Pigeons WHERE IsSold = @p0
-- Parameter @p0 = false (ge-escaped door EF Core)
```

#### ONVEILIG ALTERNATIEF (NIET GEBRUIKT):
```csharp
// DIT DOEN WE NIET! SQL Injection kwetsbaar
var id = 5;
var query = $"SELECT * FROM Pigeons WHERE Id = {id}";
var result = _context.Pigeons.FromSqlRaw(query).ToList();
```

### 3. Waar is dit toegepast?

**Bestanden met security commentaar:**
- `DuivenPlatform.Api/Services/PigeonService.cs` (regels 7-10, 21, 29)
- `DuivenPlatform.Api/Services/OrderService.cs` (regels 7-10, 19, 27, 41)

---

## Waarom deze aanpak?

1. **Best Practice:** Entity Framework Core is de aanbevolen manier voor database-toegang in .NET
2. **Automatische bescherming:** Geen handmatige escaping nodig - minder kans op fouten
3. **Maintainability:** Code blijft leesbaar en onderhoudbaar
4. **Performance:** EF Core optimaliseert queries automatisch

---

## Verificatie

Je kunt de SQL-queries die EF Core genereert loggen door in `appsettings.Development.json`:

```json
{
  "Logging": {
	"LogLevel": {
	  "Microsoft.EntityFrameworkCore.Database.Command": "Information"
	}
  }
}
```

Dit toont in de console de daadwerkelijke SQL met parameters, bijvoorbeeld:
```
info: Microsoft.EntityFrameworkCore.Database.Command[20101]
	  Executed DbCommand (12ms) [Parameters=[@p0='?' (DbType = Boolean)], CommandType='Text', CommandTimeout='30']
	  SELECT `p`.`Id`, `p`.`Description`, `p`.`ImageUrl`, `p`.`IsSold`, `p`.`Price`, `p`.`Title`
	  FROM `Pigeons` AS `p`
	  WHERE `p`.`IsSold` = @p0
```

---

## Aanvullende Security Maatregelen

Naast SQL Injection bescherming zijn ook de volgende maatregelen geïmplementeerd:

### Threat ID 69: Cross Site Request Forgery (CSRF)
- **Status:** Gemitigeerd door SPA-architectuur
- De frontend is een Single Page Application die gebruik maakt van CORS
- Alle requests vereisen expliciete `fetch()` calls vanuit JavaScript
- Geen cookies gebruikt voor authenticatie (zou antiforgery tokens vereisen)

### Threat ID 94: Potential Process Crash or Stop for Website (SPA)
- **Status:** Gemitigeerd door error handling
- Frontend heeft error handling in `app.js` voor API-calls
- Backend gebruikt try-catch waar nodig
- Database queries zijn async voor betere performance