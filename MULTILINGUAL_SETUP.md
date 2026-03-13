# CHIKITSA DESK - Multilingual Support (English, Hindi, Marathi)

## Overview
Multilingual support has been added to CHIKITSA DESK with complete translations for:
- English (EN)
- Hindi (HI) 
- Marathi (MR)

## Files Created

### Translation Files
1. `/lib/translations/en.json` - English translations
2. `/lib/translations/hi.json` - Hindi translations
3. `/lib/translations/mr.json` - Marathi translations

Each file contains comprehensive translations for:
- Common UI elements
- Patient dashboard pages
- Authentication pages (Login/Signup)
- Appointment management
- Medical records
- Doctor search and filters

### Language System Files
1. `/lib/language-context.tsx` - React Context for language management
   - Manages language state globally
   - Persists language preference to localStorage
   - Provides translation function `t(key)`

2. `/components/language-switcher.tsx` - Language selector component
   - Dropdown menu with all language options
   - Visually shows current language
   - Styled to match app theme

## How It Works

### Language Context
The `LanguageProvider` wraps the entire application in `layout.tsx` and provides:
- Current language state
- `setLanguage()` function to change language
- `t()` translation function for getting translated strings

### Language Switcher
A dropdown button in the header (AppHeader component) allows users to:
- See current language
- Switch to English, Hindi, or Marathi
- Automatically saves preference to localStorage

## Implementation

### Step 1: Update Layout
The layout.tsx already includes:
```tsx
import { LanguageProvider } from '@/lib/language-context'

<LanguageProvider>
  <AppHeader />
  {children}
</LanguageProvider>
```

### Step 2: Use Language Hook in Components
To add translations to any page component:

```tsx
'use client'

import { useLanguage } from '@/lib/language-context'

export default function YourComponent() {
  const { t } = useLanguage()
  
  return (
    <div>
      <h1>{t('patient.dashboard.title')}</h1>
      <p>{t('patient.dashboard.welcome')}</p>
    </div>
  )
}
```

### Translation Key Structure
Keys follow this pattern: `section.subsection.key`

Examples:
- `patient.dashboard.title` → Patient Dashboard
- `common.logout` → Logout
- `auth.login.email` → Email Address

## Translation JSON Structure

Each translation file contains:
```json
{
  "common": { ... },
  "patient": {
    "dashboard": { ... },
    "doctors": { ... },
    "medicalRecords": { ... }
  },
  "auth": {
    "login": { ... },
    "signup": { ... }
  }
}
```

## How to Add Translations to a Page

### Example: Patient Dashboard

```tsx
'use client'

import { useLanguage } from '@/lib/language-context'

export default function PatientDashboard() {
  const { t } = useLanguage()
  
  return (
    <div>
      {/* Welcome Section */}
      <h2>{t('patient.dashboard.welcome')}</h2>
      <p>{t('patient.dashboard.manageAppointments')}</p>
      
      {/* Quick Actions */}
      <button>{t('patient.dashboard.bookAppointment')}</button>
      <button>{t('patient.dashboard.findDoctors')}</button>
      
      {/* Appointments Section */}
      <h3>{t('patient.dashboard.appointmentsOverview')}</h3>
      <p>{t('patient.dashboard.totalAppointments')}</p>
    </div>
  )
}
```

## Language Persistence

- Language preference is automatically saved to localStorage as `chikitsa_language`
- When user returns to the site, their language choice is restored
- Default language is English if no preference is set

## Language Switcher Location

The language switcher dropdown appears in:
- Top right of the header (AppHeader component)
- Available on all authenticated pages
- Shows current language
- Dropdown reveals all 3 language options

## Features

✓ Full context-based language management
✓ Persistent language preference
✓ Easy dropdown switcher in header
✓ Comprehensive translations for all patient pages
✓ Support for 3 languages: English, Hindi, Marathi
✓ Simple translation key format
✓ Scalable for adding more languages

## Adding More Languages

To add a new language (e.g., Spanish):

1. Create `/lib/translations/es.json` with all keys from en.json
2. Import in language-context.tsx:
   ```tsx
   import esTranslations from './translations/es.json'
   const translations = {
     en: enTranslations,
     hi: hiTranslations,
     mr: mrTranslations,
     es: esTranslations, // Add this
   }
   ```
3. Update Language type: `type Language = 'en' | 'hi' | 'mr' | 'es'`
4. Update language-switcher.tsx languages array

## Testing Multilingual Setup

1. Go to any authenticated page (e.g., /patient/dashboard)
2. Look for language switcher in top right corner
3. Click the language button
4. Select English, हिंदी, or मराठी
5. Page UI elements update to selected language
6. Refresh page - language preference persists

## Supported Pages for Translation

Currently, translations are available for:
- Patient Dashboard
- Book Appointment
- Find Doctors
- Medical Records
- My Appointments
- Login/Signup forms

## Next Steps

To fully implement multilingual support on patient pages:

1. Add `useLanguage()` hook to each patient page component
2. Replace all hardcoded text strings with `t('key.path')`
3. Test each page in all 3 languages
4. Add missing translations as needed

## Translation Keys Reference

See individual translation JSON files for complete list of available keys.

All translation files are located in `/lib/translations/`
