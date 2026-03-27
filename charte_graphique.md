# Charte Graphique du Site

## 1. Palette de Couleurs

### Couleurs Principales

| Couleur           | Code HEX  | Usage                              |
| ----------------- | --------- | ---------------------------------- |
| Bleu primaire     | `#1A73E8` | Boutons, headers, liens principaux |
| Orange secondaire | `#FF6D00` | Boutons secondaires, accents       |

### Couleurs Neutres

| Couleur          | Code HEX  | Usage                     |
| ---------------- | --------- | ------------------------- |
| Fond clair       | `#F5F7FA` | Arrière-plans de sections |
| Blanc            | `#FFFFFF` | Cartes, formulaires       |
| Texte principal  | `#1F2937` | Corps de texte            |
| Texte secondaire | `#6B7280` | Labels, descriptions      |

### Couleurs d'Alerte

| État    | Code HEX  | Usage                |
| ------- | --------- | -------------------- |
| Succès  | `#16A34A` | Messages de réussite |
| Erreur  | `#DC2626` | Messages d'erreur    |
| Info    | `#2563EB` | Messages informatifs |
| Warning | `#D97706` | Avertissements       |

---

## 2. Typographie

### Police Principale

```
font-family: "Inter", "Roboto", "Arial", sans-serif;
```

### Hiérarchie des Titres

- **H1** : `font-size: 2rem; font-weight: 700;`
- **H2** : `font-size: 1.5rem; font-weight: 700;`
- **H3** : `font-size: 1.25rem; font-weight: 700;`
- **Corps** : `font-size: 1rem; font-weight: 400; line-height: 1.5;`

### Configuration de Base

```css
html {
  font-size: 16px;
  line-height: 1.5;
  color: #1f2937;
}
```

---

## 3. Boutons

### Bouton Primaire (`.btn`)

```css
.btn {
  background-color: #1a73e8;
  color: #ffffff;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  opacity: 0.95;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(26, 115, 232, 0.3);
}

.btn:active {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Bouton Secondaire (`.btn-secondary`)

```css
.btn-secondary {
  background-color: #ff6d00;
}

.btn-secondary:hover {
  box-shadow: 0 4px 12px rgba(255, 109, 0, 0.3);
}
```

---

## 4. Cartes & Conteneurs

### Carte (`.card`)

```css
.card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(15, 23, 42, 0.05);
  padding: 1.5rem;
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.1);
}
```

---

## 5. Formulaires

### Champs de Saisie

```css
input,
select,
textarea {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0.65rem 0.75rem;
  width: 100%;
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.2s ease;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #1a73e8;
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.15);
}

input:disabled,
select:disabled,
textarea:disabled {
  background-color: #f5f7fa;
  cursor: not-allowed;
  opacity: 0.6;
}
```

### Labels

```css
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #1f2937;
}
```

---

## 6. Mise en Page

### Conteneur Principal

```css
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem;
}
```

### Header & Footer

```css
header,
footer {
  background-color: #1a73e8;
  color: #ffffff;
  padding: 1.5rem 0;
  box-shadow: 0 2px 8px rgba(26, 115, 232, 0.15);
}

header a,
footer a {
  color: #ffffff;
  text-decoration: none;
}

header a:hover,
footer a:hover {
  opacity: 0.9;
  text-decoration: underline;
}
```

### Utilitaires d'Espacement

```css
.mt-24 {
  margin-top: 1.5rem;
}
.mb-24 {
  margin-bottom: 1.5rem;
}
.pt-24 {
  padding-top: 1.5rem;
}
.pb-24 {
  padding-bottom: 1.5rem;
}
.my-24 {
  margin: 1.5rem 0;
}
.py-24 {
  padding: 1.5rem 0;
}
```

---

## 7. Alertes & Messages

### Alert Box

```css
.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border-left: 4px solid;
}

.alert-success {
  background-color: #ecfdf5;
  border-color: #16a34a;
  color: #065f46;
}

.alert-error {
  background-color: #fef2f2;
  border-color: #dc2626;
  color: #7f1d1d;
}

.alert-info {
  background-color: #eff6ff;
  border-color: #2563eb;
  color: #1e3a8a;
}

.alert-warning {
  background-color: #fffbeb;
  border-color: #d97706;
  color: #78350f;
}
```

---

## 8. Icônes & Images

### Standards

- Format : SVG ou FontAwesome
- Taille actions : `24x24px`
- Taille blocs : `48x48px`
- Logos : `64x64px` minimum

### Couleurs des Icônes

- Icônes principales : `#1A73E8`
- Icônes secondaires : `#6B7280`
- Icônes d'alerte : utiliser les couleurs d'alerte correspondantes

---

## 9. Responsive Design

### Mobile-First Approach

```css
/* Configuration de base (mobile) */
body {
  font-size: 14px;
}

.container {
  padding: 1rem;
}

/* Tablette et au-dessus */
@media (min-width: 768px) {
  body {
    font-size: 16px;
  }

  .container {
    max-width: 900px;
    padding: 1.5rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1100px;
  }
}
```

### Grille Responsive

```css
.grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Menu Mobile

```css
.menu-toggle {
  display: block;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;
}

@media (min-width: 768px) {
  .menu-toggle {
    display: none;
  }
}
```

---

## 10. Animations & Transitions

### Transitions Globales

```css
* {
  transition: all 0.2s ease;
}

a,
button {
  transition: all 0.3s ease;
}
```

### Exemples d'Animations

```css
/* Hover au-dessus */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-in;
}
```

---

## 11. Accessibilité

### Focus States

```css
a:focus,
button:focus,
input:focus {
  outline: 2px solid #1a73e8;
  outline-offset: 2px;
}
```

### Contraste Minimum

- Texte sur fond : ratio 4.5:1 minimum
- Texte large sur fond : ratio 3:1 minimum

### ARIA Labels

```html
<button aria-label="Fermer menu">×</button>
<img src="logo.svg" alt="Logo du site" />
```

---

## 12. Exceptions & Cas Spéciaux

### Texte Muted

```css
.muted {
  color: #6b7280;
  font-size: 0.875rem;
}
```

### Séparateur

```css
hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.5rem 0;
}
```

### Éléments Désactivés

```css
[disabled],
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

**Dernière mise à jour** : 26 mars 2026
