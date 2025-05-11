export interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  category: "industry" | "awards" | "reviews" | "interviews" | "releases"
  author: {
    name: string
    avatar?: string
  }
  publishedAt: Date
  featured?: boolean
  tags: string[]
}

export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "Academy Awards 2024: Complete List of Winners and Nominees",
    slug: "academy-awards-2024-winners-nominees",
    excerpt:
      "The 96th Academy Awards ceremony honored the best films of 2023. Here's the complete list of winners and nominees across all categories.",
    content: `
      <p>The 96th Academy Awards ceremony, presented by the Academy of Motion Picture Arts and Sciences, honored the best films of 2023. The event took place at the Dolby Theatre in Hollywood, Los Angeles, California on March 10, 2024.</p>
      
      <h2>Best Picture</h2>
      <ul>
        <li><strong>Winner: "Oppenheimer"</strong> – Christopher Nolan, Emma Thomas, Charles Roven</li>
        <li>"American Fiction" – Ben LeClair, Nikos Karamigios, Cord Jefferson</li>
        <li>"Anatomy of a Fall" – Marie-Ange Luciani, David Thion</li>
        <li>"Barbie" – David Heyman, Margot Robbie, Tom Ackerley</li>
        <li>"The Holdovers" – Mark Johnson</li>
        <li>"Killers of the Flower Moon" – Dan Friedkin, Bradley Thomas, Martin Scorsese</li>
        <li>"Maestro" – Bradley Cooper, Steven Spielberg, Fred Berner</li>
        <li>"Past Lives" – David Hinojosa, Christine Vachon, Pamela Koffler</li>
        <li>"Poor Things" – Ed Guiney, Andrew Lowe, Yorgos Lanthimos</li>
        <li>"The Zone of Interest" – James Wilson</li>
      </ul>
      
      <h2>Best Director</h2>
      <ul>
        <li><strong>Winner: Christopher Nolan</strong> – "Oppenheimer"</li>
        <li>Justine Triet – "Anatomy of a Fall"</li>
        <li>Martin Scorsese – "Killers of the Flower Moon"</li>
        <li>Yorgos Lanthimos – "Poor Things"</li>
        <li>Jonathan Glazer – "The Zone of Interest"</li>
      </ul>
      
      <h2>Best Actor</h2>
      <ul>
        <li><strong>Winner: Cillian Murphy</strong> – "Oppenheimer" as J. Robert Oppenheimer</li>
        <li>Bradley Cooper – "Maestro" as Leonard Bernstein</li>
        <li>Colman Domingo – "Rustin" as Bayard Rustin</li>
        <li>Paul Giamatti – "The Holdovers" as Paul Hunham</li>
        <li>Jeffrey Wright – "American Fiction" as Thelonious "Monk" Ellison</li>
      </ul>
      
      <h2>Best Actress</h2>
      <ul>
        <li><strong>Winner: Emma Stone</strong> – "Poor Things" as Bella Baxter</li>
        <li>Annette Bening – "Nyad" as Diana Nyad</li>
        <li>Lily Gladstone – "Killers of the Flower Moon" as Mollie Burkhart</li>
        <li>Sandra Hüller – "Anatomy of a Fall" as Sandra Voyter</li>
        <li>Carey Mulligan – "Maestro" as Felicia Montealegre</li>
      </ul>
      
      <p>The ceremony was marked by historic wins, including Cillian Murphy becoming the first Irish-born actor to win Best Actor, and Christopher Nolan winning his first Oscar after multiple nominations throughout his career.</p>
      
      <p>"Oppenheimer" dominated the night with 7 wins, followed by "Poor Things" with 4 awards. The ceremony also featured memorable performances and emotional acceptance speeches that celebrated the art of filmmaking.</p>
    `,
    coverImage: "/news2.jpg",
    category: "awards",
    author: {
      name: "Emma Thompson",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    publishedAt: new Date("2024-03-11T12:00:00Z"),
    featured: true,
    tags: ["oscars", "academy awards", "oppenheimer", "christopher nolan", "cillian murphy", "emma stone"],
  },
  {
    id: "2",
    title: "James Cameron Announces 'Avatar 3' Release Date and Title",
    slug: "james-cameron-announces-avatar-3-release-date",
    excerpt:
      "Director James Cameron has officially announced the title and release date for the third installment in the Avatar franchise.",
    content: `
      <p>Director James Cameron has officially announced that the third installment in the groundbreaking "Avatar" franchise will be titled "Avatar: Fire and Ash" and is scheduled for release on December 19, 2025.</p>
      
      <p>Following the massive success of "Avatar: The Way of Water," which grossed over $2.3 billion worldwide, expectations are high for the next chapter in the saga of Pandora. Cameron revealed that production is already well underway, with most of the performance capture work completed.</p>
      
      <p>"We're taking the Avatar saga to new environments and introducing new cultures and creatures that audiences have never seen before," Cameron said during a press conference at 20th Century Studios. "The scope of this film is even more ambitious than the previous installments."</p>
      
      <p>Sam Worthington and Zoe Saldaña will return as Jake Sully and Neytiri, alongside Sigourney Weaver and Stephen Lang. New cast members include Michelle Yeoh and Oona Chaplin, who will play significant roles in the expanding narrative.</p>
      
      <p>Cameron also confirmed that "Avatar 4" and "Avatar 5" remain in development, with planned release dates in 2029 and 2031, respectively. The director has stated that each film will stand on its own while contributing to the larger story arc of the Na'vi and their struggle against human exploitation.</p>
      
      <p>"The technological innovations we're implementing for 'Fire and Ash' will once again push the boundaries of what's possible in cinema," Cameron added. "We're creating visual experiences that simply couldn't have been achieved even a few years ago."</p>
      
      <p>Industry analysts predict that "Avatar: Fire and Ash" could potentially match or exceed the box office performance of its predecessors, particularly given the expanded global theatrical market and advances in premium format screenings.</p>
    `,
    coverImage: "/news5.jpg",
    category: "industry",
    author: {
      name: "Michael Rivera",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    publishedAt: new Date("2024-05-02T09:30:00Z"),
    featured: true,
    tags: ["avatar", "james cameron", "sequel", "20th century studios", "pandora"],
  },
  {
    id: "3",
    title: "Cannes Film Festival 2024: Full Lineup Announced",
    slug: "cannes-film-festival-2024-lineup-announced",
    excerpt:
      "The Cannes Film Festival has unveiled its official selection for the 2024 edition, featuring new works from acclaimed directors and promising newcomers.",
    content: `
      <p>The Cannes Film Festival has unveiled its official selection for the 2024 edition, set to take place from May 14 to May 25. This year's lineup features an impressive mix of established auteurs and emerging talents from around the world.</p>
      
      <h2>Competition</h2>
      <p>The main competition includes 21 films vying for the prestigious Palme d'Or:</p>
      <ul>
        <li>"The Apprentice" – Ali Abbasi</li>
        <li>"Bird" – Andrea Arnold</li>
        <li>"Caught by the Tides" – Jia Zhangke</li>
        <li>"Emilia Perez" – Jacques Audiard</li>
        <li>"Flow" – Gus Van Sant</li>
        <li>"Grand Tour" – Miguel Gomes</li>
        <li>"The Invasion" – Sergei Loznitsa</li>
        <li>"Kinds of Kindness" – Yorgos Lanthimos</li>
        <li>"Last Summer" – Catherine Breillat</li>
        <li>"Limonov: The Ballad" – Kirill Serebrennikov</li>
        <li>"Megalopolis" – Francis Ford Coppola</li>
        <li>"Motel Destino" – Karim Aïnouz</li>
        <li>"Oh, Canada" – Paul Schrader</li>
        <li>"Parthenope" – Paolo Sorrentino</li>
        <li>"The Seed of the Sacred Fig" – Mohammad Rasoulof</li>
        <li>"Stranger Eyes" – Yeo Siew Hua</li>
        <li>"Three Kilometers to the End of the World" – Emanuel Pârvu</li>
        <li>"Anora" – Sean Baker</li>
        <li>"All We Imagine as Light" – Payal Kapadia</li>
        <li>"The Substance" – Coralie Fargeat</li>
        <li>"Wild Diamond" – Agathe Riedinger</li>
      </ul>
      
      <h2>Un Certain Regard</h2>
      <p>The Un Certain Regard section, focusing on unique and innovative works, includes 14 films from emerging directors and established filmmakers taking new creative risks.</p>
      
      <h2>Out of Competition</h2>
      <p>Several high-profile films will screen out of competition, including "Furiosa: A Mad Max Saga" by George Miller, "Horizon: An American Saga" by Kevin Costner, and "She's Got No Name" by Tony Gatlif.</p>
      
      <h2>Special Screenings</h2>
      <p>The festival will also feature special screenings of documentaries and unique works that don't fit into the traditional categories, including "Ernest Cole: Lost and Found" by Raoul Peck and "The Invasion" by Sergei Loznitsa.</p>
      
      <p>Jury president Greta Gerwig will lead the panel deciding the winners of the main competition, making her the first American female director to serve in this role.</p>
      
      <p>"This year's selection reflects the incredible diversity and vitality of contemporary cinema," said Thierry Frémaux, the festival's artistic director. "We're particularly proud of the strong representation of female directors and the global scope of the stories being told."</p>
      
      <p>The festival will open with "The Second Act," a comedy-drama directed by Quentin Dupieux, and close with "Animal Kingdom," the latest film from Thomas Cailley.</p>
    `,
    coverImage: "/news1.jpg",
    category: "industry",
    author: {
      name: "Sophie Laurent",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    publishedAt: new Date("2024-04-18T14:15:00Z"),
    tags: ["cannes", "film festival", "palme d'or", "francis ford coppola", "yorgos lanthimos"],
  },
  {
    id: "4",
    title: "Meryl Streep to Receive AFI Lifetime Achievement Award",
    slug: "meryl-streep-afi-lifetime-achievement-award",
    excerpt:
      "The American Film Institute has announced that three-time Oscar winner Meryl Streep will be honored with the 49th AFI Lifetime Achievement Award.",
    content: `
      <p>The American Film Institute (AFI) has announced that legendary actress Meryl Streep will be honored with the 49th AFI Lifetime Achievement Award, recognizing her extraordinary career spanning five decades.</p>
      
      <p>Streep, who holds the record for the most Academy Award nominations of any actor with 21 nominations and three wins, will receive the prestigious honor at a gala tribute on June 12, 2024, at the Dolby Theatre in Los Angeles.</p>
      
      <p>"Meryl Streep is a national treasure and one of the most versatile and accomplished performers in the history of cinema," said Kathleen Kennedy, Chair of the AFI Board of Trustees. "Her ability to completely transform into every character she portrays has set a new standard for acting excellence."</p>
      
      <p>Throughout her illustrious career, Streep has delivered iconic performances in films such as "Sophie's Choice," "The Devil Wears Prada," "Doubt," "The Iron Lady," and "Kramer vs. Kramer." Her work has consistently demonstrated remarkable range, technical precision, and emotional depth.</p>
      
      <p>The AFI Lifetime Achievement Award was established in 1973 to honor individuals whose careers have significantly contributed to the enrichment of American culture through motion pictures and television. Previous recipients include Jane Fonda, George Clooney, Denzel Washington, Julie Andrews, and Steven Spielberg.</p>
      
      <p>"What distinguishes Meryl is not just her extraordinary talent, but her unwavering commitment to telling women's stories and bringing complex female characters to the screen," said Bob Gazzale, AFI President and CEO. "Her legacy extends far beyond her performances to how she has fundamentally changed the landscape for women in film."</p>
      
      <p>The ceremony will be broadcast on TNT later in the year, with a special retrospective of Streep's most memorable roles. Many of her former co-stars and directors are expected to attend and pay tribute to her remarkable career.</p>
      
      <p>In response to the announcement, Streep expressed her gratitude: "I am deeply honored to receive this recognition from an institution that has done so much to preserve and celebrate the art of filmmaking. The collaborative nature of this medium has given me the opportunity to work with extraordinary filmmakers and fellow actors throughout my career, and this honor is a testament to those collaborations."</p>
    `,
    coverImage: "/news2.jpg",
    category: "awards",
    author: {
      name: "David Chen",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    publishedAt: new Date("2024-04-05T10:45:00Z"),
    tags: ["meryl streep", "afi", "lifetime achievement", "awards", "hollywood"],
  },
  {
    id: "5",
    title: "Review: 'Dune: Part Two' Expands the Epic Saga with Stunning Visuals and Deep Character Development",
    slug: "review-dune-part-two",
    excerpt:
      "Denis Villeneuve's 'Dune: Part Two' delivers on all fronts, expanding the epic saga with breathtaking visuals and compelling character arcs.",
    content: `
      <p><strong>Rating: ★★★★★ (5/5)</strong></p>
      
      <p>Denis Villeneuve's "Dune: Part Two" is that rare sequel that not only lives up to its predecessor but surpasses it in ambition, emotional depth, and visual grandeur. Picking up where the first film left off, we follow Paul Atreides (Timothée Chalamet) as he joins forces with the Fremen and begins his transformation from displaced noble to messianic figure.</p>
      
      <p>Villeneuve's direction is masterful, balancing intimate character moments with spectacular large-scale sequences that showcase the harsh beauty of Arrakis. The sandworm riding scene, in particular, stands as one of the most exhilarating sequences in recent cinema, combining practical effects with seamless CGI to create a genuine sense of awe.</p>
      
      <h2>Expanded Character Development</h2>
      
      <p>While the first film necessarily focused on world-building and setting up the complex political landscape of Frank Herbert's universe, "Part Two" delves deeper into its characters' psychological journeys. Chalamet delivers a nuanced performance as Paul, capturing his internal struggle between embracing his destiny and fearing the violent holy war that may come with it.</p>
      
      <p>Zendaya, given substantially more screen time as Chani, brings depth and fierce independence to a character who serves as both Paul's love interest and his moral compass. Their relationship evolves naturally and serves as an emotional anchor amidst the grand political machinations.</p>
      
      <p>The standout performance, however, comes from Rebecca Ferguson as Lady Jessica, whose transformation into a Reverend Mother adds layers of complexity to her already compelling character. Her scenes with the Fremen Sayyadina showcase Ferguson's remarkable ability to convey profound spiritual experiences through subtle facial expressions.</p>
      
      <h2>Technical Mastery</h2>
      
      <p>Greig Fraser's cinematography is nothing short of breathtaking, capturing the vast desert landscapes with a sense of scale that demands to be seen on the largest screen possible. The contrast between the golden dunes of Arrakis and the cold, sterile environments of the Harkonnen homeworld visually reinforces the film's thematic concerns.</p>
      
      <p>Hans Zimmer's score builds upon the otherworldly soundscape established in the first film, incorporating Fremen-inspired vocals and percussion that enhance the cultural immersion. The sound design during the sandworm sequences creates a visceral experience that resonates physically with the audience.</p>
      
      <h2>Thematic Depth</h2>
      
      <p>What elevates "Dune: Part Two" beyond a typical blockbuster is its willingness to engage with complex themes. The film thoughtfully explores the dangers of messianic figures, the exploitation of indigenous peoples and their resources, and the cyclical nature of violence. Villeneuve never offers easy answers, instead inviting the audience to grapple with these issues alongside the characters.</p>
      
      <p>The film's examination of how religions and prophecies can be manipulated for political gain feels particularly relevant to our current global climate, giving this science fiction epic a grounded resonance despite its fantastical setting.</p>
      
      <h2>Conclusion</h2>
      
      <p>"Dune: Part Two" represents cinema at its most ambitious and accomplished. It successfully balances spectacular entertainment with intellectual and emotional depth, respecting both Herbert's source material and the audience's intelligence. Villeneuve has crafted not just one of the greatest science fiction films in recent memory, but a landmark achievement in adapting complex literary works to the screen.</p>
      
      <p>As the film builds to its powerful conclusion, setting the stage for potential future installments, it cements the "Dune" saga as this generation's defining epic. In an era of formulaic franchise filmmaking, "Dune: Part Two" stands as a towering example of what's possible when visionary filmmakers are given the resources and freedom to realize their artistic ambitions.</p>
    `,
    coverImage: "/news1.jpg",
    category: "reviews",
    author: {
      name: "Alex Morgan",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    publishedAt: new Date("2024-03-05T16:20:00Z"),
    tags: ["dune", "denis villeneuve", "timothée chalamet", "zendaya", "rebecca ferguson", "review"],
  },
  {
    id: "6",
    title: "Exclusive Interview: Ryan Gosling on Preparing for His Role in 'The Fall Guy'",
    slug: "interview-ryan-gosling-the-fall-guy",
    excerpt:
      "In an exclusive interview, Ryan Gosling discusses the physical and mental preparation for his role as a stuntman in the action-comedy 'The Fall Guy'.",
    content: `
      <p>Ryan Gosling has built a career on his versatility, moving effortlessly between intense dramas, quirky comedies, and action-packed blockbusters. In his latest film, "The Fall Guy," directed by David Leitch, Gosling takes on the role of Colt Seavers, a veteran stuntman who finds himself drawn into a dangerous conspiracy while working on a major Hollywood production.</p>
      
      <p>We sat down with Gosling to discuss his preparation for the physically demanding role, his collaboration with Leitch, and his newfound appreciation for the unsung heroes of action cinema.</p>
      
      <h2>Physical Transformation</h2>
      
      <p><strong>Movono News:</strong> This role required significant physical preparation. Can you talk about your training regimen?</p>
      
      <p><strong>Ryan Gosling:</strong> It was the most intensive physical preparation I've ever done for a role. I trained with actual stuntmen for about four months before filming began. The goal wasn't just to look the part but to understand the mindset and physical awareness that stunt performers develop. I worked with Logan Holladay, who's done stunts for Marvel films, and he was instrumental in helping me understand the technical aspects of the job.</p>
      
      <p>I did a lot of wire work, practiced falling techniques, and learned how to safely execute and sell various hits and impacts. There's a whole science to making something look dangerous while actually doing it in the safest way possible. That was fascinating to learn.</p>
      
      <h2>Understanding Stunt Culture</h2>
      
      <p><strong>Movono News:</strong> Beyond the physical aspects, did you research the culture and community of stunt performers?</p>
      
      <p><strong>Ryan Gosling:</strong> Absolutely. I spent a lot of time just hanging out with stunt teams, listening to their stories. These are incredibly tight-knit communities with their own language, traditions, and gallows humor. They're artists who rarely get the recognition they deserve, and there's something beautiful about how they support each other.</p>
      
      <p>What struck me most was their matter-of-fact approach to risk. They're not adrenaline junkies; they're methodical professionals who take calculated risks after extensive preparation. There's a humility there that I really admired and tried to incorporate into Colt's character.</p>
      
      <h2>Collaboration with David Leitch</h2>
      
      <p><strong>Movono News:</strong> David Leitch was a stuntman and stunt coordinator before becoming a director. How did that influence your collaboration?</p>
      
      <p><strong>Ryan Gosling:</strong> Working with David was incredible because he speaks both languages fluently – he understands actors and the emotional journey of a character, but he also knows exactly what makes action sequences work. He could articulate things to me in a way that bridged those worlds.</p>
      
      <p>There were moments where I'd be overthinking a stunt sequence, and David would just say, "Trust me, I've done this exact fall 50 times. Here's what your body needs to do, and here's what your face needs to express." That kind of specific guidance from someone who's lived it was invaluable.</p>
      
      <h2>The Comedy Element</h2>
      
      <p><strong>Movono News:</strong> "The Fall Guy" balances intense action with comedy. How did you approach that tonal balance?</p>
      
      <p><strong>Ryan Gosling:</strong> That balance is actually true to the stunt community. These are people who do incredibly dangerous things and then immediately crack jokes about it afterward. It's partly a coping mechanism and partly just the culture.</p>
      
      <p>For me, the comedy comes from Colt's self-awareness. He knows he's not the star, he knows his body is basically a tool for making other people look good, and there's both humor and poignancy in that. We wanted the audience to laugh with him, not at him, because the character has such heart.</p>
      
      <h2>A New Appreciation</h2>
      
      <p><strong>Movono News:</strong> Has this role changed how you view action films?</p>
      
      <p><strong>Ryan Gosling:</strong> Completely. I can't watch action sequences the same way anymore. I'm always looking at the stunt performers now, trying to spot the transitions between actor and double, appreciating the artistry of what they do.</p>
      
      <p>One thing I hope this film accomplishes is giving audiences a new appreciation for these artists. When you understand what goes into creating these sequences – the preparation, the skill, the risk – it adds a whole new dimension to how you experience action cinema.</p>
      
      <p>And personally, I have nothing but respect for the stunt community. What they do requires such a unique combination of physical ability, technical knowledge, and fearlessness. They're the unsung heroes of so many of our favorite movie moments.</p>
      
      <p><em>"The Fall Guy" opens in theaters nationwide on May 3, 2024.</em></p>
    `,
    coverImage: "/news5.jpg",
    category: "interviews",
    author: {
      name: "Jessica Wu",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    publishedAt: new Date("2024-04-25T11:30:00Z"),
    tags: ["ryan gosling", "the fall guy", "david leitch", "interview", "stunts", "action"],
  },
  {
    id: "7",
    title: "Marvel Studios Announces Phase 6 Lineup at San Diego Comic-Con",
    slug: "marvel-studios-phase-6-announcement",
    excerpt:
      "Kevin Feige revealed Marvel's ambitious Phase 6 lineup at San Diego Comic-Con, including new Avengers films and surprising character introductions.",
    content: `
      <p>Marvel Studios president Kevin Feige electrified fans at San Diego Comic-Con with the unveiling of the studio's Phase 6 lineup, mapping out the next several years of the Marvel Cinematic Universe and confirming long-rumored projects.</p>
      
      <p>The presentation, which closed out the convention's legendary Hall H programming, featured surprise appearances from several Marvel stars and first-look footage that sent the crowd of 6,500 fans into a frenzy.</p>
      
      <h2>New Avengers Films</h2>
      
      <p>The most significant announcements centered around two new Avengers films. "Avengers: Doomsday," directed by the Russo brothers, will release on May 1, 2026, and will feature the long-anticipated arrival of Doctor Doom as the primary antagonist. The film will bring together both established Avengers and newer characters introduced in Phase 5.</p>
      
      <p>This will be followed by "Avengers: Secret Wars" on November 5, 2027, which Feige described as "the culmination of the Multiverse Saga" and "the most ambitious storytelling endeavor we've ever attempted."</p>
      
      <h2>Fantastic Four Details</h2>
      
      <p>Feige also shared more details about "The Fantastic Four: First Steps," scheduled for release on July 25, 2025. The film will be set primarily in the 1960s and will embrace the retro-futuristic aesthetic of the early Fantastic Four comics. The previously announced cast of Pedro Pascal as Reed Richards, Vanessa Kirby as Sue Storm, Joseph Quinn as Johnny Storm, and Ebon Moss-Bachrach as Ben Grimm appeared on stage to thunderous applause.</p>
      
      <p>Director Matt Shakman revealed that the film will not be an origin story, stating, "We're meeting the Fantastic Four as an established team, already working as explorers of the unknown. This allows us to dive right into what makes these characters special – their dynamics as a family."</p>
      
      <h2>X-Men Enter the MCU</h2>
      
      <p>Perhaps the most exciting revelation was the official announcement of "X-Men: The New Class," directed by Nia DaCosta and set for release on November 7, 2025. While the full cast wasn't revealed, Feige confirmed that the film will introduce mutants as having always existed in the MCU but in hiding.</p>
      
      <p>"The events of the Multiverse Saga have accelerated mutant emergence around the world," Feige explained. "This isn't about replacing the Fox X-Men films, which we love, but about bringing these beloved characters into our universe in a way that feels fresh while honoring what came before."</p>
      
      <h2>Disney+ Series</h2>
      
      <p>On the streaming front, Marvel announced several Disney+ series that will tie into the Phase 6 theatrical releases:</p>
      
      <ul>
        <li>"Doom," focusing on the origin and rise to power of Victor Von Doom</li>
        <li>"Strange Academy," following Doctor Strange as he mentors young sorcerers</li>
        <li>"Illuminati," featuring a secret council of brilliant minds working behind the scenes</li>
        <li>"Nova," introducing Richard Rider as he inherits the power of the Nova Corps</li>
      </ul>
      
      <h2>Special Presentations</h2>
      
      <p>Following the success of the "Werewolf by Night" and "Guardians of the Galaxy Holiday Special" formats, Marvel announced two new Special Presentations:</p>
      
      <ul>
        <li>"Silver Surfer: The Herald," a cosmic adventure introducing the character ahead of the Fantastic Four film</li>
        <li>"Hulk vs. Wolverine," which will feature the first meeting between Mark Ruffalo's Hulk and the MCU's Wolverine</li>
      </ul>
      
      <p>The presentation concluded with a sizzle reel featuring brief clips from upcoming Phase 5 projects and concept art from Phase 6, ending with a teaser image that simply showed the Avengers logo transforming into what appeared to be a variation of the Secret Wars logo from the comics.</p>
      
      <p>"The Multiverse Saga is about to reach its crescendo," Feige said in his closing remarks. "Everything we've been building toward since the end of the Infinity Saga is about to come together in ways that will surprise even the most dedicated fans."</p>
    `,
    coverImage: "/news5.jpg",
    category: "industry",
    author: {
      name: "Chris Parker",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    publishedAt: new Date("2024-04-22T18:45:00Z"),
    tags: ["marvel", "mcu", "comic-con", "kevin feige", "avengers", "fantastic four", "x-men"],
  },
  {
    id: "8",
    title: "'Gladiator II' Trailer Breakdown: Everything You Might Have Missed",
    slug: "gladiator-2-trailer-breakdown",
    excerpt:
      "The first trailer for Ridley Scott's 'Gladiator II' has arrived, packed with historical references, callbacks to the original, and hints about the sequel's story.",
    content: `
      <p>The long-awaited first trailer for Ridley Scott's "Gladiator II" has finally been released, giving fans a glimpse of the sequel to the 2000 Oscar-winning epic. Set two decades after the events of the original film, "Gladiator II" stars Paul Mescal as Lucius, the grown son of Lucilla and nephew of Commodus from the first film.</p>
      
      <p>Let's break down the key moments, historical references, and subtle details you might have missed in this action-packed trailer.</p>
      
      <h2>The New Protagonist</h2>
      
      <p>The trailer opens with a striking shot of Paul Mescal's Lucius standing before what appears to be a North African landscape. Now a grown man, Lucius seems to have been living away from Rome, perhaps in Numidia or another Roman province in Africa.</p>
      
      <p>A voiceover from Denzel Washington's character mentions "the son of the great general," suggesting that Lucius may believe Maximus was his father, or at least has adopted him as a father figure in his mind. This creates an interesting parallel to the original film, where Maximus was motivated by the murder of his family.</p>
      
      <h2>Historical Setting</h2>
      
      <p>Several visual cues suggest the film is set during the reign of Emperor Caracalla (211-217 CE), approximately 80 years after the events of the first "Gladiator." This would place Lucius in his mid-to-late 80s, so clearly the timeline has been adjusted for the story.</p>
      
      <p>The trailer shows glimpses of what appears to be the famous Baths of Caracalla in Rome, one of the emperor's major architectural projects. Historians will note that this period was marked by Caracalla's controversial edict granting Roman citizenship to all free men throughout the empire – a potential plot point that could tie into themes of identity and belonging.</p>
      
      <h2>Return to the Colosseum</h2>
      
      <p>The most spectacular sequences show the Colosseum partially flooded for a naval battle recreation, known historically as a "naumachia." These elaborate water spectacles were indeed performed in ancient Rome, though usually in purpose-built facilities rather than the Colosseum itself. However, there is some historical evidence that the Colosseum could be flooded for such events in its early years.</p>
      
      <p>The naval battle scene features what appears to be a recreation of a famous Roman naval victory, with warships, marines, and sea creatures (possibly mechanical or trained animals). This showcases Ridley Scott's commitment to the spectacular visuals that made the original film so memorable.</p>
      
      <h2>New and Returning Characters</h2>
      
      <p>Besides Mescal's Lucius, we get glimpses of several key characters:</p>
      
      <ul>
        <li>Denzel Washington appears to be playing a former gladiator turned trainer/manager, reminiscent of Oliver Reed's Proximo from the original film</li>
        <li>Pedro Pascal as a Roman general who may have connections to Maximus's past</li>
        <li>Connie Nielsen reprising her role as Lucilla, now visibly older and seemingly in a position of political influence</li>
        <li>Joseph Quinn as Emperor Caracalla, portrayed with the same menacing intensity that made Joaquin Phoenix's Commodus so memorable</li>
      </ul>
      
      <h2>Callbacks to the Original</h2>
      
      <p>The trailer is filled with subtle nods to the 2000 film:</p>
      
      <ul>
        <li>A shot of a hand running through a field of wheat, echoing Maximus's recurring dreams</li>
        <li>The distinctive helmet design worn by Lucius in the arena, similar to the one Maximus wore</li>
        <li>A brief glimpse of what might be the wooden figurines that represented Maximus's wife and son</li>
        <li>The return of Hans Zimmer's iconic score, though with new variations that suggest Lucius's journey will be distinct from Maximus's</li>
      </ul>
      
      <h2>Themes and Motifs</h2>
      
      <p>The trailer suggests that "Gladiator II" will explore themes of legacy, identity, and the corruption of empire – all central to the original film. However, new elements appear to include:</p>
      
      <ul>
        <li>The influence of North African and Eastern cultures on Rome, visible in the costume and set designs</li>
        <li>Religious conflict, with symbols of both traditional Roman religion and early Christianity visible in certain scenes</li>
        <li>The changing nature of gladiatorial combat, which by this period had evolved into even more spectacular (and sometimes grotesque) forms of entertainment</li>
      </ul>
      
      <h2>Visual Style</h2>
      
      <p>Cinematographer John Mathieson returns from the original film, and his distinctive visual approach is evident. The color palette appears to contrast sun-baked exteriors in North Africa with the cooler, more shadowed interiors of Rome. Scott's trademark attention to detail in production design is evident in every frame, from the intricate armor designs to the massive architectural sets.</p>
      
      <h2>Conclusion</h2>
      
      <p>"Gladiator II" appears to be balancing respect for the original with a determination to tell a new story. Rather than simply rehashing the revenge narrative of the first film, this sequel seems to be exploring how the legacy of characters like Maximus and Commodus continues to influence the Roman world decades later.</p>
      
      <p>The film is scheduled for release on November 22, 2024, and based on this trailer, it promises to be one of the most visually stunning and dramatically compelling historical epics in recent memory.</p>
    `,
    coverImage: "/news3.jpg",
    category: "releases",
    author: {
      name: "Marcus Aurelius",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    publishedAt: new Date("2024-05-01T09:15:00Z"),
    tags: ["gladiator", "ridley scott", "paul mescal", "denzel washington", "trailer", "analysis"],
  },
]

export function getRecentArticles(count = 5): NewsArticle[] {
  return [...newsArticles].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()).slice(0, count)
}

export function getFeaturedArticles(count = 3): NewsArticle[] {
  return newsArticles.filter((article) => article.featured).slice(0, count)
}

export function getArticlesByCategory(category: NewsArticle["category"], count?: number): NewsArticle[] {
  const filtered = newsArticles.filter((article) => article.category === category)
  return count ? filtered.slice(0, count) : filtered
}

export function getArticleBySlug(slug: string): NewsArticle | undefined {
  return newsArticles.find((article) => article.slug === slug)
}

export function searchArticles(query: string): NewsArticle[] {
  const lowercaseQuery = query.toLowerCase()
  return newsArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.excerpt.toLowerCase().includes(lowercaseQuery) ||
      article.content.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}

export const categories = [
  { value: "industry", label: "Industry News" },
  { value: "awards", label: "Awards & Events" },
  { value: "reviews", label: "Reviews" },
  { value: "interviews", label: "Interviews" },
  { value: "releases", label: "Releases" },
]
