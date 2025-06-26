export interface FeaturedMovie {
    id: string;
    title: string;
    plot: string;
    genre: string[];
    backdrop_url: string;
    imdb_id: string;
  }
  
  export const featuredMovies: FeaturedMovie[] = [
    {
      id: "1",
      title: "Inside Out 2",
      plot: "Riley navigates the complexities of adolescence as new emotions emerge, challenging her existing ones.",
      genre: ["Animation", "Adventure", "Comedy"],
      backdrop_url: "/featured/insideout2.jpg",
      imdb_id: "tt22022452",
    },
    {
      id: "2",
      title: "Deadpool & Wolverine",
      plot: "Deadpool teams up with Wolverine in a multiversal adventure filled with chaos and unexpected alliances.",
      genre: ["Action", "Comedy", "Sci-Fi"],
      backdrop_url: "/featured/deadpool.jpg",
      imdb_id: "tt6263850",
    },
    {
      id: "3",
      title: "Ne Zha 2",
      plot: "Ne Zha returns to confront new challenges, blending mythological elements with modern storytelling.",
      genre: ["Animation", "Fantasy", "Action"],
      backdrop_url: "/featured/nezha.jpg",
      imdb_id: "tt34956443",
    },
    {
      id: "4",
      title: "Dune: Part Two",
      plot: "Paul Atreides continues his journey, uniting with the Fremen to seek revenge and prevent a dark future.",
      genre: ["Adventure", "Drama", "Sci-Fi"],
      backdrop_url: "/featured/dune2.jpg",
      imdb_id: "tt15239678",
    },
    {
      id: "5",
      title: "Despicable Me 4",
      plot: "Gru faces new challenges as a father and villain when a new nemesis threatens his family.",
      genre: ["Animation", "Comedy", "Family"],
      backdrop_url: "/featured/despicible.jpg",
      imdb_id: "tt7510222",
    },
    {
      id: "6",
      title: "Moana 2",
      plot: "Moana sets sail once again to explore new horizons and uncover ancient mysteries of the seas.",
      genre: ["Animation", "Adventure", "Family"],
      backdrop_url: "/featured/moana2.jpeg",
      imdb_id: "tt13622970",
    },
    {
      id: "7",
      title: "Wicked",
      plot: "A reimagining of the classic tale, exploring the untold story of the witches of Oz.",
      genre: ["Fantasy", "Musical", "Romance"],
      backdrop_url: "/featured/wicked.jpg",
      imdb_id: "tt1262426",
    },
    {
      id: "8",
      title: "Godzilla x Kong: The New Empire",
      plot: "Godzilla and Kong face a colossal new threat, testing their alliance and strength.",
      genre: ["Action", "Adventure", "Sci-Fi"],
      backdrop_url: "/featured/godzilla.jpeg",
      imdb_id: "tt14539740",
    },
    {
      id: "9",
      title: "Kung Fu Panda 4",
      plot: "Po embarks on a new journey to discover his true destiny and confront formidable foes.",
      genre: ["Animation", "Action", "Comedy"],
      backdrop_url: "/featured/kungfupanda.jpg",
      imdb_id: "tt21692408",
    },
    {
      id: "10",
      title: "Beetlejuice Beetlejuice",
      plot: "The mischievous ghost returns, bringing chaos and laughter in this long-awaited sequel.",
      genre: ["Comedy", "Fantasy", "Horror"],
      backdrop_url: "/featured/beetlejuice.webp",
      imdb_id: "tt2049403",
    },
    {
      id: "11",
      title: "Gladiator II",
      plot: "A new chapter unfolds in the arena, where honor and vengeance collide in ancient Rome.",
      genre: ["Action", "Adventure", "Drama"],
      backdrop_url: "/featured/gladiator2.webp",
      imdb_id: "tt9218128",
    },
    {
      id: "12",
      title: "Alien: Romulus",
      plot: "A terrifying journey unfolds as a new crew encounters the deadly xenomorphs in deep space.",
      genre: ["Horror", "Sci-Fi", "Thriller"],
      backdrop_url: "/featured/alien.jpg",
      imdb_id: "tt18412256",
    },
    {
      id: "13",
      title: "Kingdom of the Planet of the Apes",
      plot: "In a post-apocalyptic world, apes and humans vie for dominance and survival.",
      genre: ["Action", "Adventure", "Sci-Fi"],
      backdrop_url: "/featured/kingdomofapes.jpg",
      imdb_id: "tt11389872",
    },
    {
      id: "14",
      title: "Twisters",
      plot: "Storm chasers confront unprecedented tornadoes, pushing the limits of science and survival.",
      genre: ["Action", "Drama", "Thriller"],
      backdrop_url: "/featured/twisters.webp",
      imdb_id: "tt12584954",
    },
    {
      id: "15",
      title: "A Minecraft Movie",
      plot: "An epic adventure unfolds in the blocky world of Minecraft, where creativity knows no bounds.",
      genre: ["Animation", "Adventure", "Family"],
      backdrop_url: "/featured/minecraft.jpg",
      imdb_id: "tt3566834",
    },
  ];