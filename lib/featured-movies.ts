export interface FeaturedMovie {
    id: number;
    title: string;
    description: string;
    genres: string[];
    backgroundImage: string;
    imdbId: string; // Add imdbId to the interface
  }
  
  export const featuredMovies: FeaturedMovie[] = [
    {
      id: 1,
      title: "Inside Out 2",
      description:
        "Riley navigates the complexities of adolescence as new emotions emerge, challenging her existing ones.",
      genres: ["Animation", "Adventure", "Comedy"],
      backgroundImage: "/featured/insideout2.jpg",
      imdbId: "tt22022452",
    },
    {
      id: 2,
      title: "Deadpool & Wolverine",
      description:
        "Deadpool teams up with Wolverine in a multiversal adventure filled with chaos and unexpected alliances.",
      genres: ["Action", "Comedy", "Sci-Fi"],
      backgroundImage: "/featured/deadpool.jpg",
      imdbId: "tt6263850",
    },
    {
      id: 3,
      title: "Ne Zha 2",
      description:
        "Ne Zha returns to confront new challenges, blending mythological elements with modern storytelling.",
      genres: ["Animation", "Fantasy", "Action"],
      backgroundImage: "/featured/nezha.jpg",
      imdbId: "tt34956443",
    },
    {
      id: 4,
      title: "Dune: Part Two",
      description:
        "Paul Atreides continues his journey, uniting with the Fremen to seek revenge and prevent a dark future.",
      genres: ["Adventure", "Drama", "Sci-Fi"],
      backgroundImage: "/featured/dune2.jpg",
      imdbId: "tt15239678",
    },
    {
      id: 5,
      title: "Despicable Me 4",
      description:
        "Gru faces new challenges as a father and villain when a new nemesis threatens his family.",
      genres: ["Animation", "Comedy", "Family"],
      backgroundImage: "/featured/despicible.jpg",
      imdbId: "tt7510222",
    },
    {
      id: 6,
      title: "Moana 2",
      description:
        "Moana sets sail once again to explore new horizons and uncover ancient mysteries of the seas.",
      genres: ["Animation", "Adventure", "Family"],
      backgroundImage: "/featured/moana2.jpeg",
      imdbId: "tt13622970",
    },
    {
      id: 7,
      title: "Wicked",
      description:
        "A reimagining of the classic tale, exploring the untold story of the witches of Oz.",
      genres: ["Fantasy", "Musical", "Romance"],
      backgroundImage: "/featured/wicked.jpg",
      imdbId: "tt1262426",
    },
    {
      id: 8,
      title: "Godzilla x Kong: The New Empire",
      description:
        "Godzilla and Kong face a colossal new threat, testing their alliance and strength.",
      genres: ["Action", "Adventure", "Sci-Fi"],
      backgroundImage: "/featured/godzilla.jpeg",
      imdbId: "tt14539740",
    },
    {
      id: 9,
      title: "Kung Fu Panda 4",
      description:
        "Po embarks on a new journey to discover his true destiny and confront formidable foes.",
      genres: ["Animation", "Action", "Comedy"],
      backgroundImage: "/featured/kungfupanda.jpg",
      imdbId: "tt21692408",
    },
    {
      id: 10,
      title: "Beetlejuice Beetlejuice",
      description:
        "The mischievous ghost returns, bringing chaos and laughter in this long-awaited sequel.",
      genres: ["Comedy", "Fantasy", "Horror"],
      backgroundImage: "/featured/beetlejuice.webp",
      imdbId: "tt2049403",
    },
    {
      id: 11,
      title: "Gladiator II",
      description:
        "A new chapter unfolds in the arena, where honor and vengeance collide in ancient Rome.",
      genres: ["Action", "Adventure", "Drama"],
      backgroundImage: "/featured/gladiator2.webp",
      imdbId: "tt9218128",
    },
    {
      id: 12,
      title: "Alien: Romulus",
      description:
        "A terrifying journey unfolds as a new crew encounters the deadly xenomorphs in deep space.",
      genres: ["Horror", "Sci-Fi", "Thriller"],
      backgroundImage: "/featured/alien.jpg",
      imdbId: "tt18412256",
    },
    {
      id: 13,
      title: "Kingdom of the Planet of the Apes",
      description:
        "In a post-apocalyptic world, apes and humans vie for dominance and survival.",
      genres: ["Action", "Adventure", "Sci-Fi"],
      backgroundImage: "/featured/kingdomofapes.jpg",
      imdbId: "tt11389872",
    },
    {
      id: 14,
      title: "Twisters",
      description:
        "Storm chasers confront unprecedented tornadoes, pushing the limits of science and survival.",
      genres: ["Action", "Drama", "Thriller"],
      backgroundImage: "/featured/twisters.webp",
      imdbId: "tt12584954",
    },
    {
      id: 15,
      title: "A Minecraft Movie",
      description:
        "An epic adventure unfolds in the blocky world of Minecraft, where creativity knows no bounds.",
      genres: ["Animation", "Adventure", "Family"],
      backgroundImage: "/featured/minecraft.jpg",
      imdbId: "tt3566834",
    },
  ];