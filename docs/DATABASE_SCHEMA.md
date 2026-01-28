# Database Schema Reference

**Provider**: Supabase (PostgreSQL)
**Schema**: `public`

## 1. Tables

### `profiles`
User identity and shared profile data.
- **id** (uuid, PK): Internal profile ID.
- **user_id** (uuid, FK -> auth.users): Links to Supabase Auth.
- **name** (text): Display name.
- **profile_json** (jsonb): Stores structured preferences.
    - `dietary_preferences`: list[str] (e.g., "vegan", "keto")
    - `health_restrictions`: list[str] (e.g., "diabetes")
    - `allergies`: list[str] (e.g., "peanuts")
    - `custom_avoidance`: list[str] (raw ingredient names)


### `history`
Log of all scans and analyses.
- **id** (uuid, PK)
- **user_id** (uuid, FK)
- **barcode** (text): Scanned content.
- **product_name** (text): Resolved name.
- **request_payload** (jsonb): What was sent to `/check`.
- **analysis_result** (jsonb): The full JSON output from `/check`.
- **processing_time_ms** (int)

### `api_keys`
Platform-level access keys (B2B).
- **id** (uuid, PK)
- **customer_name** (text)
- **key_hash** (text): Hashed storage of the key (plain key not stored).
- **quota_remaining** (int)

## 2. JSON Structures

### Analysis Result (`history.analysis_result`)
```json
{
  "status": "safe|not_safe",
  "verdict_title": "Clean",
  "flagged_ingredients": ["Sugar", "E621"],
  "health_insights": ["High sugar content"],
  "taxonomy": [
    {
      "id": "en:sugar",
      "display": "Sugar",
      "synonyms": ["sucrose"]
    }
  ]
}
```
