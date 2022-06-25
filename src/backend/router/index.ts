import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/backend/utils/prisma";
import { getOptionsForVote } from "@/utils/getRandomPokemon";

export const appRouter = trpc
   .router()
   .query("get-pokemon-by-id", {
      input: z.object({ id: z.number() }),
      async resolve({ input }) {
         const pokemon = await prisma.pokemon.findFirst({ where: { id: input.id } });
         if (!pokemon) throw new Error(`pokemon doesn't exists`);
         return { name: pokemon.name, spriteUrl: pokemon.spriteUrl };
      },
   })
   .query("get-pokemon-pair", {
      async resolve() {
         const [first, second] = getOptionsForVote();

         const pokemonPair = await prisma.pokemon.findMany({
            where: {
               id: {
                  in: [first, second],
               },
            },
         });

         if (pokemonPair.length !== 2) {
            throw new Error("failed to find two pokemon");
         }

         return { firstPokemon: pokemonPair[0], secondPokemon: pokemonPair[1] };
      },
   })
   .mutation("cast-vote", {
      input: z.object({
         votedFor: z.number(),
         votedAgainst: z.number(),
      }),
      async resolve({ input }) {
         const voteInDb = await prisma.vote.create({
            data: {
               votedForId: input.votedFor,
               votedAgainstId: input.votedAgainst,
            },
         });

         return { success: true, vote: voteInDb };
      },
   });

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
