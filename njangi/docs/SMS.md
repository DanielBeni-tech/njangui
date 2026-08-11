# SMS — Architecture pour les notifications de lancement

## Fournisseurs compatibles Cameroun

### 1. Twilio (Programmable SMS)
- **Couverture Cameroun**: Oui, via des partenaires locaux
- **API**: REST API robuste, SDKs officiels
- **Coût**: ~0.05 USD/SMS vers Cameroun
- **Fiabilité**: Élevée
- **Envoi en masse**: Oui, avec bonnes pratiques
- **Conformité**: Conforme, opt-in géré
- **Intégration**: Très facile

### 2. Africa's Talking
- **Couverture Cameroun**: Excellent, spécialisé Afrique
- **API**: REST API, SDKs
- **Coût**: Très compétitif pour l'Afrique
- **Fiabilité**: Bonne
- **Envoi en masse**: Oui
- **Conformité**: Conforme réglementations africaines
- **Intégration**: Facile

### 3. MessageBird
- **Couverture Cameroun**: Oui
- **API**: REST API complète
- **Coût**: Moyen
- **Fiabilité**: Élevée
- **Envoi en masse**: Oui
- **Conformité**: Conforme
- **Intégration**: Facile

### 4. Termii
- **Couverture Cameroun**: Oui
- **API**: REST API simple
- **Coût**: Compétitif
- **Fiabilité**: Bonne
- **Envoi en masse**: Oui
- **Conformité**: Conforme
- **Intégration**: Très facile

## Recommandation V1

**Africa's Talking** est recommandé pour le MVP car :
- Spécialisé sur le marché africain
- Tarifs compétitifs
- Bonne documentation
- Support en cas de problème

## Architecture SMS

```
Admin Dashboard
    ↓
POST /api/admin/waitlist/notify
    ↓
lib/sms.ts (provider agnostic)
    ↓
Africa's Talking / Twilio / etc.
    ↓
SMS → Utilisateur
    ↓
notification_status = sent/failed
```

## Contraintes SMS

- **Opt-in obligatoire**: L'utilisateur doit avoir choisi explicitement d'être notifié par SMS
- **Template approuvé**: Le contenu du message doit être pré-approuvé par le provider
- **Stop/Unsubscribe**: Inclure un mot-clé de désinscription
- **Heures d'envoi**: Respecter les heures autorisées par la réglementation camerounaise
- **Vitesse d'envoi**: Limiter le débit pour éviter le blocage

## Exemple de message SMS

```
Njangi: Njangi est maintenant disponible ! Telechargez l'app sur Google Play/App Store. Desinscription: reply STOP
```

## Implémentation future

Le code ci-dessous est un exemple de structure à implémenter :

```typescript
// lib/sms.ts
export async function sendSms(phone: string, message: string) {
  // Choisir le provider selon env var
  const provider = process.env.SMS_PROVIDER
  
  switch (provider) {
    case 'africas-talking':
      return sendViaAfricasTalking(phone, message)
    case 'twilio':
      return sendViaTwilio(phone, message)
    default:
      throw new Error('SMS_PROVIDER not configured')
  }
}
```

## Statut SMS

```typescript
enum SmsStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  UNSUBSCRIBED = 'unsubscribed'
}
```
