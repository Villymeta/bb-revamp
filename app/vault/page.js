import Image from "next/image";

// ----------------------------
// DATA
// ----------------------------
const doginalDogs = [
  {
    id: 4800,
    src: "/vault/doginal-dogs/4800.png",
    link: "https://market.doginaldogs.com/inscription/6db92faa98b8efc580ce16299d08eeb79d1b49909ef61e274391e1e9d1c845c1i0",
  },
  {
    id: 2439,
    src: "/vault/doginal-dogs/2439.png",
    link: "https://market.doginaldogs.com/inscription/f32093a7c9769b80e18ae9b55dedc05a2f42bfafc9796a855232f0254aab4900i0",
  },
  {
    id: 6988,
    src: "/vault/doginal-dogs/6988.png",
    link: "https://market.doginaldogs.com/inscription/5a4cc22f0bda05c54bf248d7ab3e2e549684de497fcb64df03f80054898806b0i0",
  },
  {
    id: 6480,
    src: "/vault/doginal-dogs/6480.png",
    link: "https://market.doginaldogs.com/inscription/36acea179415073ce8dd570e4a716eb7fdb451c5b23b8a4c59703847dfefd911i0",
  },
  {
    id: 3724,
    src: "/vault/doginal-dogs/3724.png",
    link: "https://market.doginaldogs.com/inscription/0603e9804e48d4d5a47fb0d46c32dfa8be67721083d5df5ca5fa122f65d6b60ai0",
  },
  {
    id: 7914,
    src: "/vault/doginal-dogs/7914.png",
    link: "https://market.doginaldogs.com/inscription/d6f18756db04a6b2319ef927ce2e977d9cdde002ae8db8b9b6eb6cd0c5262592i0",
  },
];

const regenerates = [
  {
    id: 1459,
    src: "/vault/regenerates/1459.jpeg",
    link: "https://opensea.io/item/base/0x56dfe6ae26bf3043dc8fdf33bf739b4ff4b3bc4a/1459",
  },
  {
    id: 259,
    src: "/vault/regenerates/259.jpeg",
    link: "https://opensea.io/item/base/0x56dfe6ae26bf3043dc8fdf33bf739b4ff4b3bc4a/259",
  },
];

const quirkies = [
  {
    id: 964,
    src: "/vault/quirkies/964.jpeg",
    link: "https://opensea.io/item/ethereum/0xd4b7d9bb20fa20ddada9ecef8a7355ca983cccb1/964",
  },
];

const deadDucks = [
  {
    id: 886,
    src: "/vault/dead-ducks/886.jpeg",
    link: "https://opensea.io/item/ethereum/0xd66c8af378627844c36b8d65bf88c08e03e853ce/886",
  },
  {
    id: 887,
    src: "/vault/dead-ducks/887.jpeg",
    link: "https://opensea.io/item/ethereum/0xd66c8af378627844c36b8d65bf88c08e03e853ce/887",
  },
  {
    id: 888,
    src: "/vault/dead-ducks/888.jpeg",
    link: "https://opensea.io/item/ethereum/0xd66c8af378627844c36b8d65bf88c08e03e853ce/888",
  },
  {
    id: 889,
    src: "/vault/dead-ducks/889.jpeg",
    link: "https://opensea.io/item/ethereum/0xd66c8af378627844c36b8d65bf88c08e03e853ce/889",
  },
  {
    id: 890,
    src: "/vault/dead-ducks/890.jpeg",
    link: "https://opensea.io/item/ethereum/0xd66c8af378627844c36b8d65bf88c08e03e853ce/890",
  },
  {
    id: 941,
    src: "/vault/dead-ducks/941.jpeg",
    link: "https://opensea.io/item/ethereum/0xd66c8af378627844c36b8d65bf88c08e03e853ce/941",
  },
  {
    id: 942,
    src: "/vault/dead-ducks/942.jpeg",
    link: "https://opensea.io/item/ethereum/0xd66c8af378627844c36b8d65bf88c08e03e853ce/942",
  },
  {
    id: 943,
    src: "/vault/dead-ducks/943.jpeg",
    link: "https://opensea.io/item/ethereum/0xd66c8af378627844c36b8d65bf88c08e03e853ce/943",
  },
  {
    id: 1007,
    src: "/vault/dead-ducks/1007.jpeg",
    link: "https://opensea.io/item/ethereum/0xd66c8af378627844c36b8d65bf88c08e03e853ce/1007",
  },
  {
    id: 1008,
    src: "/vault/dead-ducks/1008.jpeg",
    link: "https://opensea.io/item/ethereum/0xd66c8af378627844c36b8d65bf88c08e03e853ce/1008",
  },
];

// ----------------------------
// SHARED: compact card base
// ----------------------------
function CardShell({ children }) {
  return (
    <div
      className="
        rounded-lg overflow-hidden bg-black/25 w-full 
        text-[12px] sm:text-[13px] 
        transition-all duration-150 
        hover:-translate-y-[3px] 
        hover:shadow-[0_0_18px_rgba(250,204,21,0.45)]
        h-full flex flex-col
      "
    >
      {children}
    </div>
  );
}

// ----------------------------
// DOGINAL DOGS
// ----------------------------
function DogCard({ id, src, bg, link }) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block">
      <CardShell>
        <div
          className="w-full aspect-square flex items-center justify-center"
          style={{ backgroundColor: bg }}
        >
          <div className="relative w-[80%] h-[120%]">
            <Image
              src={src}
              alt={`Doginal Dog ${id}`}
              fill
              className="object-contain"
              sizes="160px"
            />
          </div>
        </div>

        <div className="p-2.5">
          <p className="font-semibold text-white leading-tight text-[13px]">
            Doginal Dog #{id}
          </p>
        </div>
      </CardShell>
    </a>
  );
}

function DoginalDogsGrid() {
  return (
    <div className="grid grid-cols-3 gap-4 sm:flex sm:gap-4 sm:overflow-x-auto pb-2">
      {doginalDogs.map((dog) => (
        <div key={dog.id} className="w-full sm:w-[140px] shrink-0">
          <DogCard {...dog} />
        </div>
      ))}
    </div>
  );
}

function DoginalDogsSection() {
  return (
    <section className="mt-6 relative border border-white/15 rounded-2xl bg-transparent p-4 sm:p-5">
      {/* Corner accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-300/40" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yellow-300/40" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yellow-300/40" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-300/40" />
      </div>

      {/* Content */}
      <div className="relative">
        {/* Yellow accent bar */}
        <div className="mx-auto mb-2 h-[3px] w-12 bg-yellow-300 rounded-full" />

        <a
          href="https://x.com/doginaldogs"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-[32px] sm:text-[40px] font-semibold uppercase tracking-[0.3em] text-yellow-300 mb-3 hover:text-yellow-200 transition drop-shadow-[0_0_6px_rgba(250,250,0,0.45)]"
        >
          Doginal Dogs
        </a>

        {/* Gradient divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4" />

        <DoginalDogsGrid />
      </div>
    </section>
  );
}

// ----------------------------
// RE:GENERATES
// ----------------------------
function RegenCard({ id, src, link }) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">
      <CardShell>
        <div className="relative w-full aspect-[4/4]">
          <Image
            src={src}
            alt={`re:gen #${id}`}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        <div className="p-2 min-h-[40px] flex items-center">
          <p className="font-semibold text-white text-[12px] leading-tight">
            re:gen #{id}
          </p>
        </div>
      </CardShell>
    </a>
  );
}

// ----------------------------
// QUIRKIES ORIGINALS
// ----------------------------
function QuirkyCard({ id, src, link }) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">
      <CardShell>
        <div className="relative w-full aspect-[4/4] overflow-hidden">
          <Image
            src={src}
            alt={`Quirkies #${id}`}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        <div className="p-2 min-h-[40px] flex items-center">
          <p className="font-semibold text-white text-[12px] leading-tight">
            Quirkies #{id}
          </p>
        </div>
      </CardShell>
    </a>
  );
}

// ----------------------------
// Regens + Quirkies row
// ----------------------------
function RegenAndQuirkiesSection() {
  return (
    <section className="mt-8 relative grid grid-cols-2 gap-4 sm:gap-6">
      {/* BOB watermark in the middle */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.2] z-0 translate-x-3">
  <Image
    src="/vault/bob-logo.png"
    alt="BOB Logo"
    width={130}
    height={130}
    className="object-contain"
  />
</div>

      {/* LEFT – RE:GENERATES */}
      <div className="relative z-10 border border-white/15 rounded-2xl bg-transparent p-4 sm:p-5">
        {/* corner accents */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-300/40" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yellow-300/40" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yellow-300/40" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-300/40" />
        </div>

        <div className="mx-auto mb-2 h-[3px] w-12 bg-yellow-300 rounded-full" />

        <a
          href="https://x.com/re_generates"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-[10px] sm:text-[20px] tracking-[0.3em] text-yellow-300 uppercase font-semibold mb-3"
        >
          re:generates
        </a>

        <div className="flex justify-center gap-3 sm:gap-4">
          {regenerates.map((gen) => (
            <div
              key={gen.id}
              className="w-[50%] sm:w-[80px] h-[120px]"
            >
              <RegenCard {...gen} />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT – QUIRKIES */}
      <div className="relative z-10 border border-white/15 rounded-2xl bg-transparent p-4 sm:p-5">
        {/* corner accents */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-300/40" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yellow-300/40" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yellow-300/40" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-300/40" />
        </div>

        <div className="mx-auto mb-2 h-[3px] w-12 bg-yellow-300 rounded-full" />

        <a
          href="https://x.com/quirkiesnft"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-[10px] sm:text-[20px] tracking-[0.3em] text-yellow-300 uppercase font-semibold mb-3"
        >
          Quirkies Originals
        </a>

        <div className="flex justify-center">
          <div className="w-[50%] sm:w-[80px] h-[120px]">
            {quirkies.map((q) => (
              <QuirkyCard key={q.id} {...q} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------------
// DEAD DUCKS
// ----------------------------
function DeadDuckCard({ id, src, link }) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block">
      <CardShell>
        <div className="relative w-full aspect-square">
          <Image
            src={src}
            alt={`Dead Duck #${id}`}
            fill
            className="object-cover"
            sizes="160px"
          />
        </div>

        <div className="p-2.5">
          <p className="font-semibold text-white leading-tight text-[13px]">
            Dead Duck #{id}
          </p>
        </div>
      </CardShell>
    </a>
  );
}

function DeadDucksSection() {
  return (
    <section className="mt-8 relative border border-white/15 rounded-2xl bg-transparent p-4 sm:p-5">
      {/* corner accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-300/40" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yellow-300/40" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yellow-300/40" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-300/40" />
      </div>

      <div className="relative">
        <div className="mx-auto mb-2 h-[3px] w-12 bg-yellow-300 rounded-full" />

        <a
          href="https://x.com/DeadDucks_NFT"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-[20px] font-semibold uppercase tracking-[0.3em] text-yellow-300 mb-3 hover:text-yellow-200 transition drop-shadow-[0_0_6px_rgba(250,250,0,0.45)]"
        >
          Dead Ducks Collective
        </a>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4" />

        {/* rows of 3 on mobile, scale up on larger screens */}
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
          {deadDucks.map((duck) => (
            <DeadDuckCard key={duck.id} {...duck} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ----------------------------
// MAIN PAGE
// ----------------------------
export default function Vault() {
  return (
    <main className="min-h-screen bg-black text-white flex justify-center px-4 sm:px-6 py-10">
      <div className="relative max-w-5xl w-full bg-black/80 border border-white/10 rounded-[2.25rem] p-6 sm:p-8 overflow-hidden">
        {/* subtle radial overlay only (logo moved to Re:generates/Quirkies row) */}
        <div
          className="
            pointer-events-none absolute inset-0 
            bg-[radial-gradient(circle_at_top,_rgba(250,250,210,0.11),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(255,255,255,0.08),_transparent_55%)]
            opacity-30
          "
        />

        {/* Content sits above overlays */}
        <div className="relative z-10">
          <header className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-[0.25em]">
              Beanie DAO
            </h1>
            <p className="text-xl sm:text-2xl font-semibold uppercase tracking-[0.35em] text-yellow-300 mt-1">
              Vault
            </p>
          </header>

          <DoginalDogsSection />
          <RegenAndQuirkiesSection />
          <DeadDucksSection />
        </div>
      </div>
    </main>
  );
}