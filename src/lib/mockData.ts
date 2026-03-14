export interface Product {
    id: string | number;
    titolo: string;
    categoria: 'Contenitori' | 'Vignette' | 'Lampade' | 'Biglietti 3D';
    prezzo: number;
    descrizione_breve: string;
}

export const mockProducts: Product[] = [
    // Categoria: Contenitori
    {
        id: 'c1',
        titolo: 'Portapenne Esagonale Modulare',
        categoria: 'Contenitori',
        prezzo: 14.90,
        descrizione_breve: 'Organizza la tua scrivania con stile geometrico.'
    },
    {
        id: 'c2',
        titolo: 'Svuotatasche "Onda"',
        categoria: 'Contenitori',
        prezzo: 19.50,
        descrizione_breve: 'Linee fluide per accogliere chiavi e piccoli oggetti.'
    },
    {
        id: 'c3',
        titolo: 'Scatolina Porta-Gioie a Cuore',
        categoria: 'Contenitori',
        prezzo: 12.00,
        descrizione_breve: 'Piccola e preziosa, stampata in materiale ecosostenibile.'
    },
    {
        id: 'c4',
        titolo: 'Vaso "PixelArt"',
        categoria: 'Contenitori',
        prezzo: 24.90,
        descrizione_breve: 'Design retrò per le tue piantine grasse.'
    },

    // Categoria: Vignette
    {
        id: 'v1',
        titolo: 'Vignetta "Oggi No"',
        categoria: 'Vignette',
        prezzo: 9.90,
        descrizione_breve: 'Il messaggio perfetto per la tua scrivania in ufficio.'
    },
    {
        id: 'v2',
        titolo: 'Vignetta "Coffee First"',
        categoria: 'Vignette',
        prezzo: 11.50,
        descrizione_breve: 'Per gli amanti del caffè prima di iniziare la giornata.'
    },
    {
        id: 'v3',
        titolo: 'Vignetta Segnaposto "Genio al lavoro"',
        categoria: 'Vignette',
        prezzo: 8.90,
        descrizione_breve: 'Ironica e simpatica, ideale come regalo.'
    },

    // Categoria: Lampade
    {
        id: 'l1',
        titolo: 'Lampada Luna Piena Ricaricabile',
        categoria: 'Lampade',
        prezzo: 29.90,
        descrizione_breve: 'Atmosfera spaziale direttamente sul tuo comodino.'
    },
    {
        id: 'l2',
        titolo: 'Lampada "Nuvola Soffice"',
        categoria: 'Lampade',
        prezzo: 34.50,
        descrizione_breve: 'Luce calda e rilassante per la camera dei bimbi.'
    },
    {
        id: 'l3',
        titolo: 'Abat-jour "Cristallo Triangolare"',
        categoria: 'Lampade',
        prezzo: 26.00,
        descrizione_breve: 'Design moderno con texture geometrica trasparente.'
    },

    // Categoria: Biglietti 3D
    {
        id: 'b1',
        titolo: 'Biglietto "Ti Voglio Bene" Pop-Up',
        categoria: 'Biglietti 3D',
        prezzo: 7.50,
        descrizione_breve: 'Sorprendi chi ami con un cuore che salta fuori.'
    },
    {
        id: 'b2',
        titolo: 'Biglietto "Buon Compleanno Torta"',
        categoria: 'Biglietti 3D',
        prezzo: 8.90,
        descrizione_breve: 'Una vera mini-torta in 3D senza calorie!'
    },
    {
        id: 'b3',
        titolo: 'Biglietto "Nuova Casa"',
        categoria: 'Biglietti 3D',
        prezzo: 6.90,
        descrizione_breve: 'Augura il meglio con una minuscola casetta stampata.'
    }
];
