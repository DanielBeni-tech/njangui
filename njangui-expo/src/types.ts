export type Membre = {
  id: string;
  nom: string;
  aPaye: boolean;
};

export type OrdreReception = 'aleatoire' | 'defini';

export type Tontine = {
  id: string;
  nom: string;
  montant: number;
  frequence: string;
  prochaineEcheance: string;
  enCours: boolean;
  dateDebut: Date;
  ordreReception: OrdreReception;
  nombreMembres: number;
  paiementsEnregistres: boolean;
  prevuesObligatoires: boolean;
  membresVoientHistorique: boolean;
  gestionnaire: string;
  membres: Membre[];
  codeInvitation: string;
};

export type TypeNotification =
  | 'nouvelleTontine'
  | 'nouveauMembre'
  | 'retardContribution'
  | 'nouveauDepot';

export type NotificationModel = {
  id: string;
  titre: string;
  message: string;
  date: Date;
  type: TypeNotification;
  lu: boolean;
};
