// Update these entries with the owner's real work before presenting client work.
// No external project URLs or unverified client claims are implied by these concepts.
export const projects = [
  {
    id: 'orbit',
    name: 'Orbit',
    kind: 'Wallet dashboard',
    year: '01',
    image: './artwork/orbit.svg',
    alt: 'Orbit concept: a light wallet dashboard with a green balance chart and asset list.',
    tags: ['Product design', 'Frontend'],
    summary: 'A clearer picture of your onchain world.',
    description:
      'A self-initiated wallet dashboard concept that brings balances, assets, and recent activity into one calm workspace. The idea is to make the information easy to scan before asking someone to take action.',
    challenge:
      'Wallet interfaces can make everyday decisions feel complicated. This exploration separates the account overview from individual assets and makes the next step easy to find.',
    approach:
      'A restrained green palette, a simple balance chart, and a consistent asset list establish a clear reading order. Account actions sit beside the information they affect.',
    scope:
      'Interface concept, visual system, and responsive layout study. The artwork is illustrative; it is not a connected wallet or a deployed product.',
    tools: ['Figma', 'React', 'TypeScript'],
  },
  {
    id: 'forma',
    name: 'Forma',
    kind: 'Digital collectibles',
    year: '02',
    image: './artwork/forma.svg',
    alt: 'Forma concept: a dark digital art gallery featuring three colorful geometric sculptures.',
    tags: ['Web design', 'Creative development'],
    summary: 'A quiet space for a new kind of collection.',
    description:
      'A self-initiated digital collectibles concept where the artwork leads. Forma explores how a gallery can feel expressive and focused while keeping collection details within reach.',
    challenge:
      'Collectible marketplaces often compete with the art they are showing. This exploration gives each piece room and keeps the path from discovery to detail straightforward.',
    approach:
      'A dark gallery frame, generous spacing, and bright sculptural objects create contrast. Repeated artwork layouts keep browsing predictable without flattening the character of the collection.',
    scope:
      'Art direction, gallery interface, and responsive layout study. The collection and its artwork are original illustrative concepts, with no real NFTs or minting flow.',
    tools: ['Figma', 'React', 'CSS'],
  },
] as const

export type Project = (typeof projects)[number]

export const skills = [
  {
    number: '01',
    title: 'Design that makes sense',
    description:
      'From the first wireframe to the final detail. Clear interfaces that put people first.',
    tags: ['UI / UX design', 'Design systems', 'Figma'],
  },
  {
    number: '02',
    title: 'Ideas, brought to the browser',
    description:
      'Responsive, accessible websites with the care and polish your idea deserves.',
    tags: ['React', 'TypeScript', 'Responsive development'],
  },
  {
    number: '03',
    title: 'A feel for the onchain world',
    description:
      'Wallets, collectibles, and communities. Familiar experiences for unfamiliar technology.',
    tags: ['Web3 interfaces', 'Wallet UX', 'NFT experiences'],
  },
] as const
