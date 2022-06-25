import { GetStaticProps, NextPage } from "next";
import { prisma } from "@/backend/utils/prisma";
import type { AsyncReturnType } from "../utils/ts-bs";
import Image from "next/image";

const getPokemonInOrder = async () => {
   return await prisma.pokemon.findMany({
      orderBy: {
         votesFor: { _count: "desc" },
      },
      select: {
         id: true,
         name: true,
         spriteUrl: true,
         _count: {
            select: {
               votesAgainst: true,
               votesFor: true,
            },
         },
      },
   });
};

type PokemonsQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const generateCountPercent = (pokemon: PokemonsQueryResult[number]) => {
   const { votesFor, votesAgainst } = pokemon._count;
   if (votesFor + votesAgainst === 0) {
      return 0;
   }
   return (votesFor / (votesFor + votesAgainst)) * 100;
};

export const PokemonListing: React.FC<{ pokemon: PokemonsQueryResult[number]; rank: number }> = ({
   pokemon,
   rank,
}) => {
   return (
      <div className="flex border p-2 items-center justify-between">
         <div className="flex items-center">
            <div>{rank}</div>
            <Image
               src={pokemon.spriteUrl}
               alt={pokemon.name}
               width={64}
               height={64}
               layout="fixed"
            />
            <h4 className="captalize">{pokemon.name}</h4>
         </div>
         <div className="pr-4">{generateCountPercent(pokemon)}%</div>
      </div>
   );
};

interface Props {
   pokemons: PokemonsQueryResult;
}

const ResultsPage: NextPage<Props> = ({ pokemons }) => {
   console.log(pokemons);
   return (
      <div className="flex flex-col items-center">
         <h2 className="text-2xl p-4">Results</h2>
         <div className="flex flex-col w-full max-w-2xl">
            {pokemons
               .sort((a, b) => {
                  const difference = generateCountPercent(b) - generateCountPercent(a);
                  if (difference === 0) {
                     return b._count.votesFor - a._count.votesFor;
                  }
                  return difference;
               })
               .map((pokemon, index) => (
                  <PokemonListing pokemon={pokemon} key={pokemon.id} rank={index + 1} />
               ))}
         </div>
      </div>
   );
};

export default ResultsPage;

export const getStaticProps: GetStaticProps = async () => {
   const pokemonOrderd = await getPokemonInOrder();

   return {
      props: {
         pokemons: pokemonOrderd,
      },
      revalidate: 60,
   };
};
