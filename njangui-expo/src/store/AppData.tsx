import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  Membre,
  NotificationModel,
  Tontine,
  TypeNotification,
} from '../types';

const tontinesInitiales: Tontine[] = [
  {
    id: '1',
    nom: 'Famille cité verte',
    montant: 10000,
    frequence: 'mois',
    prochaineEcheance: '12 Jan',
    enCours: false,
    dateDebut: new Date(2024, 1, 1),
    ordreReception: 'aleatoire',
    nombreMembres: 3,
    paiementsEnregistres: true,
    prevuesObligatoires: true,
    membresVoientHistorique: true,
    gestionnaire: 'Emmanuel',
    codeInvitation: 'FAM001',
    membres: [
      { id: '1', nom: 'Marie', aPaye: true },
      { id: '2', nom: 'Jean-Paul', aPaye: false },
      { id: '3', nom: 'Josiane', aPaye: true },
    ],
  },
  {
    id: '2',
    nom: 'Cotisation camarade',
    montant: 2500,
    frequence: 'semaine',
    prochaineEcheance: 'En cours',
    enCours: true,
    dateDebut: new Date(2024, 0, 15),
    ordreReception: 'defini',
    nombreMembres: 2,
    paiementsEnregistres: true,
    prevuesObligatoires: false,
    membresVoientHistorique: true,
    gestionnaire: 'Emmanuel',
    codeInvitation: 'COT002',
    membres: [
      { id: '1', nom: 'Paul', aPaye: true },
      { id: '2', nom: 'Sophie', aPaye: false },
    ],
  },
];

type AppDataValue = {
  tontines: Tontine[];
  notifications: NotificationModel[];
  nonLues: number;
  addTontine: (tontine: Tontine) => void;
  removeTontine: (id: string) => void;
  findTontineById: (id: string) => Tontine | undefined;
  findTontineByCode: (code: string) => Tontine | undefined;
  addMembre: (tontineId: string, membre: Membre) => void;
  setMembrePaiement: (tontineId: string, membreId: string, aPaye: boolean) => void;
  addNotification: (notification: {
    titre: string;
    message: string;
    type: TypeNotification;
  }) => void;
  marquerCommeLue: (id: string) => void;
  marquerToutesCommeLues: () => void;
  notifyNouvelleTontine: (nomTontine: string) => void;
  notifyNouveauMembre: (nomMembre: string, nomTontine: string) => void;
  notifyRetard: (nomMembre: string, nomTontine: string) => void;
  notifyNouveauDepot: (
    nomMembre: string,
    montant: number,
    nomTontine: string,
  ) => void;
};

const AppDataContext = createContext<AppDataValue | null>(null);

let sequence = 0;

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [tontines, setTontines] = useState<Tontine[]>(tontinesInitiales);
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);

  const addTontine = useCallback((tontine: Tontine) => {
    setTontines((prev) => [...prev, tontine]);
  }, []);

  const removeTontine = useCallback((id: string) => {
    setTontines((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const findTontineById = useCallback(
    (id: string) => tontines.find((t) => t.id === id),
    [tontines],
  );

  const findTontineByCode = useCallback(
    (code: string) =>
      tontines.find(
        (t) => t.codeInvitation.toUpperCase() === code.trim().toUpperCase(),
      ),
    [tontines],
  );

  const addMembre = useCallback((tontineId: string, membre: Membre) => {
    setTontines((prev) =>
      prev.map((t) =>
        t.id === tontineId
          ? { ...t, membres: [...t.membres, membre] }
          : t,
      ),
    );
  }, []);

  const setMembrePaiement = useCallback(
    (tontineId: string, membreId: string, aPaye: boolean) => {
      setTontines((prev) =>
        prev.map((t) =>
          t.id === tontineId
            ? {
                ...t,
                membres: t.membres.map((m) =>
                  m.id === membreId ? { ...m, aPaye } : m,
                ),
              }
            : t,
        ),
      );
    },
    [],
  );

  const addNotification = useCallback(
    ({
      titre,
      message,
      type,
    }: {
      titre: string;
      message: string;
      type: TypeNotification;
    }) => {
      const notification: NotificationModel = {
        id: `${Date.now()}-${++sequence}`,
        titre,
        message,
        date: new Date(),
        type,
        lu: false,
      };
      setNotifications((prev) => [notification, ...prev]);
    },
    [],
  );

  const marquerCommeLue = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lu: true } : n)),
    );
  }, []);

  const marquerToutesCommeLues = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));
  }, []);

  const notifyNouvelleTontine = useCallback(
    (nomTontine: string) => {
      addNotification({
        titre: 'Nouvelle tontine créée',
        message: `Vous avez créé la tontine "${nomTontine}"`,
        type: 'nouvelleTontine',
      });
    },
    [addNotification],
  );

  const notifyNouveauMembre = useCallback(
    (nomMembre: string, nomTontine: string) => {
      addNotification({
        titre: 'Nouveau membre',
        message: `${nomMembre} a rejoint la tontine "${nomTontine}"`,
        type: 'nouveauMembre',
      });
    },
    [addNotification],
  );

  const notifyRetard = useCallback(
    (nomMembre: string, nomTontine: string) => {
      addNotification({
        titre: 'Retard de contribution',
        message: `${nomMembre} est en retard dans la tontine "${nomTontine}"`,
        type: 'retardContribution',
      });
    },
    [addNotification],
  );

  const notifyNouveauDepot = useCallback(
    (nomMembre: string, montant: number, nomTontine: string) => {
      addNotification({
        titre: 'Nouveau dépôt',
        message: `${nomMembre} a payé ${montant.toFixed(0)} FCFA dans "${nomTontine}"`,
        type: 'nouveauDepot',
      });
    },
    [addNotification],
  );

  const nonLues = useMemo(
    () => notifications.filter((n) => !n.lu).length,
    [notifications],
  );

  const value = useMemo<AppDataValue>(
    () => ({
      tontines,
      notifications,
      nonLues,
      addTontine,
      removeTontine,
      findTontineById,
      findTontineByCode,
      addMembre,
      setMembrePaiement,
      addNotification,
      marquerCommeLue,
      marquerToutesCommeLues,
      notifyNouvelleTontine,
      notifyNouveauMembre,
      notifyRetard,
      notifyNouveauDepot,
    }),
    [
      tontines,
      notifications,
      nonLues,
      addTontine,
      removeTontine,
      findTontineById,
      findTontineByCode,
      addMembre,
      setMembrePaiement,
      addNotification,
      marquerCommeLue,
      marquerToutesCommeLues,
      notifyNouvelleTontine,
      notifyNouveauMembre,
      notifyRetard,
      notifyNouveauDepot,
    ],
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData(): AppDataValue {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData doit être utilisé dans AppDataProvider');
  }
  return context;
}
