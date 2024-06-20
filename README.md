# NOBS Modul
Bygget i [Preact](https://preactjs.com/) og kompilert i [Parcel](https://parceljs.org/) for minimal størrelse og maksimal skalerbarhet og kompatibilitet. Bruker også Typescript og SCSS for økt robusthet.

Boilerplate benyttet: [benevolarX/parcel-preact-typescript-boilerplate](https://github.com/benevolarX/parcel-preact-typescript-boilerplate)

Det anbefales å sjekke [React Docs](https://react.dev/reference/react), spesielt området om [Hooks](https://react.dev/reference/react/hooks) for å sørge for riktig praktisk bruk av React.

## Installasjon
**Sørg for at du har [NodeJS](https://nodejs.org/en/) eller [Bun](https://bun.sh) installert**

Det anbefales sterkt å bruke [VsCode](https://code.visualstudio.com)

1. Klon GitHub repository med GitHub Desktop eller `git clone https://github.com/CodeoNordic/nobs-module-template-preact`
2. Følg terminal-kommandoene
```sh
cd nobs-module-base
npm install # eller bun install
```

### Utvikling
1. Kjør `npm start` i terminal
2. Åpne [`Dev.fmp12`](./Dev.fmp12) og gå til `Dev` layout
3. Skru på utviklings-modus via `Enable/Disable DevMode` knappen
4. Gjør endringer i kildekoden og trykk på refresh-knappen

Fram til [#8615](https://github.com/parcel-bundler/parcel/issues/8615) (Aktiv pull request [#8616](https://github.com/parcel-bundler/parcel/pull/8616)) hos Parcel er løst, må vi benytte `--no-hmr` under utvikling for å hindre regelmessige krasj, hvilket betyr at man må refreshe modulen hver gang man gjør endringer.

`Enable/Disable DevMode` bytter mellom utviklings- og produksjonsversjonen. Dersom utviklings-modus er skrudd på, settes web-viewer til `localhost:1234`, mens i produksjons-modus hentes kildekode fra `Widgets` tabellen.

### Bygging
#### 1. Kontroller at [`widget.json`](./widget.json) konfigurasjonen er riktig
- `name` brukes som en identifikator, slik at FileMaker vet hvilken komponent det er man prøver å laste opp.
- `uploadScript` tilsvarer navnet på FileMaker-skriptet som skal lagre web-komponenten på server.
- `file` må tilsvare FileMaker-filen som skal ta imot komponenten, f.eks `NOBS_Calendar`
- `server` bestemmer hvilken server-addresse filen skal lastes opp til. `$` symbolet tilsvarer serveren til den aktive FileMaker-filen. Dette feltet kan f.eks. byttes ut med `devmaster.codeo.no`
- Om nødvendig, kan flere parametre legges til i JSON-filen. Alle nøkler som ikke tilsvarer de nevnt over vil inkluderes i skript-parametret.

[`widget.json`](./widget.json) kan ha forskjellige verdier per branch siden `widget.json merge=ours` er benyttet i [`.gitattributes`](./.gitattributes).
Det samme gjelder for [`Dev.fmp12`](./Dev.fmp12)

#### 2. Bygg web-komponenten
```sh
npm run build # eller bun run b:build
```

#### 3. Last opp web-komponenten til FileMaker
```sh
npm run upload # eller bun run b:upload
```

#### For å kjøre steg 2 og 3 samtidig
```sh
npm run upload:clean # eller bun run b:upload:clean
```

## Integrasjon mellom FileMaker og web-modulen
- Info sendes fra FileMaker til web via `Perform JavaScript in Web Viewer`
- Info sendes fra web til FileMaker via `FileMaker.PerformScript()`

Som standard brukes `init()` for å initialisere web-modulen, der aktuelle JSON parametre gis.

For å benytte verdier i `config` i React, bruk `useConfig` fra [`@context/Config`](./src/context/Config.tsx)

```tsx
import { useConfig } from '@context/Config';

const MyComponent: React.FC = () => {
    const config = useConfig();

    // ...
}
```

## Konsepter
### Parcel
Siden FileMaker kun lar oss sende HTML-kode via tekst, betyr det at sluttresultatet må ligge i én HTML-fil. Dette gjøres ved bruk av Parcel.

Når man bygger komponenten, vil man se hvilke filer som ble kompilert når alt er ferdig. Dersom det er mer enn bare HTML-filen, vil ikke komponenten kunne fungere riktig i FileMaker.

Eksempel på riktig resultat:
```sh
> npm run build
✨ Built in 3.87s

dist\index.html    32.95 KB    1.32s
```

Eksempel på dårlig resultat:
```sh
> npm run build
✨ Built in 3.37s

dist\index.html                 15.52 KB    858ms
dist\codeo_logo.27960b70.png    13.14 KB    262ms
```

### Kjøring av skript via web-modulen
Prosjektmalen kommer ferdigstilt med [`performScript()`](./src/utils/performScript.ts) funksjonen. Formålet er at skriptnavn skal gis via `config` fra FileMaker, slik at det ikke blir en mismatch mellom skriptnavn.

Funksjonen vil også automatisk benytte `JSON.stringify()`, da skript parametre sendt til FileMaker må være av typen tekst.

Nøkler som anses som gyldige skriptnavn skal defineres i [`config.d.ts`](src/types/config.d.ts)

```tsx
import performScript from '@utils/performScript';
import CustomRecordComponent from '@components/...';

// ...

<CustomRecordComponent
    data={recordData}
    onClick={() => performScript('onRecordClick', recordData)}
/>
```

### Innhenting av Script Result fra web
Funksjonen [`fetchFromFileMaker()`]() kjører gitt skript, og returnerer script result i et Promise.

Her benyttes også nøkler gitt fra **config.scriptNames**.

```tsx
import { useState, useCallback } from 'preact/hooks';

import fetchFromFileMaker from '@utils/fetchFromFileMaker';
import getRecordsFromObject from '@utils/getRecordsFromObject';

const contactsPerClick = 10;

async function getContacts(offset: number) {
    const records = await fetchFromFileMaker('getContacts', { limit: contactsPerClick, offset });
    return getRecordsFromObject<FM.ContactRecord>(records) ?? [];
}

const MyComponent: React.FC = () => {
    const [contacts, setContacts] = useState<FM.ContactRecord[]>([]);
    const [offset, setOffset] = useState<number>(1);

    // Create a 'loading' state to prevent running the script multiple times
    const [loading, setLoading] = useState<boolean>(false);

    const loadMore = useCallback(() => {
        setLoading(true);

        // Fetch the contacts
        getContacts(offset)
            .then(res => {
                // Update the contacts React state
                setContacts(prev => [...prev, ...res]);

                // Increment offset for the next click
                setOffset(offset + contactsPerClick);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return <>
        <div className="emails">
            {/* Map over each contact and display its E-mail */}
            {contacts.map((contact, i) => <li key={i}>
                {contact.Email}
            </li>)}
        </div>

        <button onClick={loadMore}>Load more</button>
    </>
}
```
I dette eksemplet vil det først være 0 E-poster i listen, fram til man trykker på "Load More".
Da vil koden hente kontakter via skriptet under nøkkelen `getContacts`, og sette en React-state.

### Import aliaser
Det er mulig å importere filer fra f.eks [`src/utils`](./src/utils/) via `@utils` alias.
Disse aliasene er tilgjengelig under `paths` i [`tsconfig.json`](./tsconfig.json).

**NB:** Når VsCode autofyller inn import path, vil den jobbe fra øverst til nederst med aliaser.
Derfor er det viktig at de dypeste mappene ligger øverst.

### Bilder
For at bilder skal inlines riktig inn i HTML, må man bruke `data-url:` syntaks.
```tsx
import codeoLogo from 'data-url:@png/codeo_logo.png';

// ...
<img src={codeoLogo} width="100" height="100" />
```

### SVG ikoner
Likt med bilder, kan SVG ikoner også importeres. Da bruker man `jsx:` syntaks.
Ikoner som importeres med denne syntaksen vil konverteres til en brukbar React-komponent.
```tsx
import ProfileIcon from 'jsx:@svg/profile.svg';

// ...
<ProfileIcon width="20" height="20">
```
