from tkinter import *
from random import shuffle
from collections import namedtuple

# ===================== STYLE =====================
BG_TABLE = "#0b5d3b"  # feutrine verte
BG_TABLE_DARK = "#083f28"  # zone de jeu
GOLD = "#d4af37"
WHITE = "#ffffff"
ROUGE = "#c0392b"
NOIR = "#1a1a1a"
DOS_CARTE = "#123a6b"
BTN_TIRER = "#2e86de"
BTN_RESTER = "#e67e22"
BTN_DISABLED = "#555555"
TXT_CLAIR = "#f2f2f2"

FONT_TITRE = ("Georgia", 26, "bold")
FONT_SOUS = ("Segoe UI", 11)
FONT_NOM = ("Segoe UI", 14, "bold")
FONT_SCORE = ("Segoe UI", 13, "bold")
FONT_RESULT = ("Segoe UI", 14, "bold")
FONT_BTN = ("Segoe UI", 12, "bold")
FONT_CARTE_VAL = ("Georgia", 16, "bold")
FONT_CARTE_SYM = ("Georgia", 22, "bold")

# ===================== DONNEES CARTES =====================
Carte = namedtuple("Carte", ["couleur", "valeur"])

VALEUR = ["As", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Valet", "Dame", "Roi"]
COULEUR = ["Coeur", "Carreau", "Pique", "Treffle"]
CARTE_ROUGE = ["Coeur", "Carreau"]
SYMBOLE = {"Coeur": "♥", "Carreau": "♦", "Pique": "♠", "Treffle": "♣"}

paquet = []
carte_joueur = []
carte_croupier = []


def creer_paquet():
    p = [Carte(couleur, valeur) for couleur in COULEUR for valeur in VALEUR]
    shuffle(p)
    return p


def get_valeur_carte(carte):
    if carte.valeur in ("Valet", "Dame", "Roi"):
        return 10
    if carte.valeur == "As":
        return 11
    return int(carte.valeur)


def get_score(cartes):
    score = sum(get_valeur_carte(c) for c in cartes)
    nombre_as = sum(1 for c in cartes if c.valeur == "As")
    while score > 21 and nombre_as > 0:
        score -= 10
        nombre_as -= 1
    return score


# ===================== DESSIN DES CARTES (avec Frame/Label) =====================


def dessiner_carte(parent, carte=None, cachee=False):
    boite = Frame(
        parent,
        width=80,
        height=115,
        highlightbackground="#cccccc",
        highlightthickness=1,
    )
    boite.pack_propagate(False)
    boite.pack(side="left", padx=6, pady=6)

    if cachee:
        boite.config(bg=DOS_CARTE, highlightbackground="#0d3b66")
        Label(
            boite, text="★", font=("Georgia", 26, "bold"), bg=DOS_CARTE, fg=GOLD
        ).pack(expand=True)
        return boite

    couleur_txt = ROUGE if carte.couleur in CARTE_ROUGE else NOIR
    symbole = SYMBOLE[carte.couleur]
    boite.config(bg="white")

    # coin haut-gauche : valeur + symbole
    haut = Frame(boite, bg="white")
    haut.pack(anchor="nw", padx=5, pady=(4, 0))
    Label(
        haut,
        text=carte.valeur,
        font=("Segoe UI", 11, "bold"),
        bg="white",
        fg=couleur_txt,
    ).pack()
    Label(
        haut, text=symbole, font=("Segoe UI", 10, "bold"), bg="white", fg=couleur_txt
    ).pack()

    # centre : gros symbole
    Label(boite, text=symbole, font=FONT_CARTE_SYM, bg="white", fg=couleur_txt).pack(
        expand=True
    )

    # coin bas-droit : valeur (facultatif, simple répétition)
    bas = Frame(boite, bg="white")
    bas.pack(anchor="se", padx=5, pady=(0, 4))
    Label(
        bas, text=carte.valeur, font=("Segoe UI", 9, "bold"), bg="white", fg=couleur_txt
    ).pack()

    return boite


def vider(boite):
    for widget in boite.winfo_children():
        widget.destroy()


def afficher_mains(cache_croupier=True):
    vider(croupier_box)
    vider(user_box)

    for i, carte in enumerate(carte_croupier):
        cacher = cache_croupier and i == 1
        dessiner_carte(croupier_box, carte, cachee=cacher)

    for carte in carte_joueur:
        dessiner_carte(user_box, carte)

    score_croupier_label.config(
        text="?" if cache_croupier else str(get_score(carte_croupier))
    )
    score_joueur_label.config(text=str(get_score(carte_joueur)))


# ===================== BOUTONS STYLISES =====================


def bouton(parent, texte, commande, bg):
    return Button(
        parent,
        text=texte,
        command=commande,
        font=FONT_BTN,
        bg=bg,
        fg="white",
        activebackground=bg,
        activeforeground="white",
        relief="flat",
        bd=0,
        padx=24,
        pady=10,
        cursor="hand2",
    )


def etat_boutons(start, tirer, rester):
    start_btn.config(state=start, bg=GOLD if start == "normal" else BTN_DISABLED)
    tirer_btn.config(state=tirer, bg=BTN_TIRER if tirer == "normal" else BTN_DISABLED)
    rester_btn.config(
        state=rester, bg=BTN_RESTER if rester == "normal" else BTN_DISABLED
    )


# ===================== LOGIQUE DU JEU =====================


def start_game():
    global paquet, carte_joueur, carte_croupier
    paquet = creer_paquet()
    carte_joueur = [paquet.pop(), paquet.pop()]
    carte_croupier = [paquet.pop(), paquet.pop()]

    afficher_mains(cache_croupier=True)
    result_label.config(text="À vous de jouer : Tirer ou Rester", fg=TXT_CLAIR)
    start_btn.config(text="Rejouer")
    etat_boutons("disabled", "normal", "normal")


def fin_manche(message, couleur):
    afficher_mains(cache_croupier=False)
    result_label.config(text=message, fg=couleur)
    etat_boutons("normal", "disabled", "disabled")


def tirer():
    carte_joueur.append(paquet.pop())
    afficher_mains(cache_croupier=True)

    score = get_score(carte_joueur)
    if score > 21:
        fin_manche(f"Vous dépassez 21 ({score}) — le croupier gagne.", ROUGE)


def rester():
    while get_score(carte_croupier) < 17:
        carte_croupier.append(paquet.pop())

    sj, sc = get_score(carte_joueur), get_score(carte_croupier)

    if sc > 21:
        fin_manche(f"Le croupier dépasse 21 ({sc}) — vous gagnez !", "#2ecc71")
    elif sc > sj:
        fin_manche(f"Croupier {sc} vs Vous {sj} — le croupier gagne.", ROUGE)
    elif sc < sj:
        fin_manche(f"Vous {sj} vs Croupier {sc} — vous gagnez !", "#2ecc71")
    else:
        fin_manche(f"Égalité ({sj}) — push.", GOLD)


# ===================== INTERFACE =====================

fenetre = Tk()
fenetre.title("Blackjack")
fenetre.geometry("700x640")
fenetre.config(bg=BG_TABLE)
fenetre.resizable(False, False)

Label(fenetre, text="♠ Blackjack ♥", font=FONT_TITRE, bg=BG_TABLE, fg=GOLD).pack(
    pady=(25, 4)
)
Label(
    fenetre,
    text="Approchez-vous de 21 sans le dépasser",
    font=FONT_SOUS,
    bg=BG_TABLE,
    fg=TXT_CLAIR,
).pack()

table = Frame(fenetre, bg=BG_TABLE_DARK, highlightbackground=GOLD, highlightthickness=2)
table.pack(pady=25, padx=40, fill="both", expand=True)

# ---- Zone croupier ----
zone_croupier = Frame(table, bg=BG_TABLE_DARK)
zone_croupier.pack(pady=(20, 10))

entete_croupier = Frame(zone_croupier, bg=BG_TABLE_DARK)
entete_croupier.pack()
Label(
    entete_croupier, text="Croupier", font=FONT_NOM, bg=BG_TABLE_DARK, fg=TXT_CLAIR
).pack(side="left")
score_croupier_label = Label(
    entete_croupier, text="0", font=FONT_SCORE, bg=BG_TABLE_DARK, fg=GOLD
)
score_croupier_label.pack(side="left", padx=8)

croupier_box = Frame(zone_croupier, bg=BG_TABLE_DARK, height=125)
croupier_box.pack(pady=8)

Frame(table, bg=GOLD, height=1).pack(fill="x", padx=60, pady=10)

# ---- Zone joueur ----
zone_joueur = Frame(table, bg=BG_TABLE_DARK)
zone_joueur.pack(pady=(10, 20))

entete_joueur = Frame(zone_joueur, bg=BG_TABLE_DARK)
entete_joueur.pack()
Label(entete_joueur, text="Vous", font=FONT_NOM, bg=BG_TABLE_DARK, fg=TXT_CLAIR).pack(
    side="left"
)
score_joueur_label = Label(
    entete_joueur, text="0", font=FONT_SCORE, bg=BG_TABLE_DARK, fg=GOLD
)
score_joueur_label.pack(side="left", padx=8)

user_box = Frame(zone_joueur, bg=BG_TABLE_DARK, height=125)
user_box.pack(pady=8)

# ---- Résultat ----
result_label = Label(
    fenetre,
    text="Cliquez sur Commencer pour jouer",
    font=FONT_RESULT,
    bg=BG_TABLE,
    fg=TXT_CLAIR,
)
result_label.pack(pady=(0, 10))

# ---- Boutons ----
boite_controle = Frame(fenetre, bg=BG_TABLE)
boite_controle.pack(pady=10)

start_btn = bouton(boite_controle, "Commencer", start_game, GOLD)
start_btn.grid(row=0, column=0, padx=15)

tirer_btn = bouton(boite_controle, "Tirer", tirer, BTN_DISABLED)
tirer_btn.config(state="disabled")
tirer_btn.grid(row=0, column=1, padx=15)

rester_btn = bouton(boite_controle, "Rester", rester, BTN_DISABLED)
rester_btn.config(state="disabled")
rester_btn.grid(row=0, column=2, padx=15)

fenetre.mainloop()
