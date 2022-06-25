/* eslint-disable @next/next/no-img-element */
// import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";
// import { useState } from "react";
import { inferQueryResponse } from "./api/trpc/[trpc]";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

const btn =
   "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

const Home: NextPage = () => {
   // const [ids, updateIds] = useState(() => getOptionsForVote());

   // const [first, second] = ids;

   // const firstPokemon = trpc.useQuery(["get-pokemon-by-id", { id: first }]);
   // const secondPokemon = trpc.useQuery(["get-pokemon-by-id", { id: second }]);

   const {
      data: pokemonPair,
      isLoading,
      refetch,
   } = trpc.useQuery(["get-pokemon-pair"], {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
   });

   const voteMutation = trpc.useMutation(["cast-vote"]);

   const voteForRoundest = (selected: number) => {
      if (!pokemonPair) return;
      // todo: fire mutation to presist changes
      if (selected === pokemonPair?.firstPokemon.id) {
         voteMutation.mutate({
            votedFor: pokemonPair.firstPokemon.id,
            votedAgainst: pokemonPair.secondPokemon.id,
         });
      } else {
         voteMutation.mutate({
            votedFor: pokemonPair?.secondPokemon.id,
            votedAgainst: pokemonPair?.firstPokemon.id,
         });
      }

      refetch();
   };

   return (
      <div className="h-screen w-screen flex flex-col justify-between items-center relative">
         <Head>
            <title>Roundest Pokemon</title>
         </Head>
         <div className="text-2xl text-center pt-8">Which Pokémon is Rounder?</div>
         {pokemonPair && (
            <div className="p-8 flex justify-between items-center max-w-2xl flex-col md:flex-row animate-fade-in">
               <PokemonListing
                  pokemon={pokemonPair.firstPokemon}
                  vote={() => voteForRoundest(pokemonPair.firstPokemon.id)}
                  // disabled={fetchingNext}
               />
               <div className="p-8 italic text-xl">{"or"}</div>
               <PokemonListing
                  pokemon={pokemonPair.secondPokemon}
                  vote={() => voteForRoundest(pokemonPair.secondPokemon.id)}
                  // disabled={fetchingNext}
               />
               {/* <div className="p-2" /> */}
            </div>
         )}
         {/* {!pokemonPair && <img src="/rings.svg" className="w-48" />} */}
         <div className="w-full text-xl text-center p-4">
            <Link href="/results">
               <a>Results</a>
            </Link>
         </div>
      </div>
   );
};

export default Home;

type PokemonFromServer = inferQueryResponse<"get-pokemon-pair">["firstPokemon"];

export const PokemonListing: React.FC<{ pokemon: PokemonFromServer; vote: () => void }> = props => {
   return (
      <div className="flex flex-col items-center">
         <Image
            src={props.pokemon?.spriteUrl!}
            alt="first-pokemon-image"
            width={256}
            height={256}
            layout="fixed"
            className="animate-fade-in"
         />
         <div className="text-xl text-center capitalize mt-[-2rem]">{props.pokemon?.name}</div>
         <div className="p-2" />
         <button className={btn} onClick={() => props.vote()}>
            Rounder
         </button>
      </div>
   );
};
