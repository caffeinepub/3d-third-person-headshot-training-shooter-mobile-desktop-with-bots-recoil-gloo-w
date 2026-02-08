import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PlayerProfile, PlayerSettings, ScoreRecord } from '../backend';

export function useGetPlayerProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  
  const query = useQuery<PlayerProfile>({
    queryKey: ['playerProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPlayerProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false
  });
  
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched
  };
}

export function useSavePlayerSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: PlayerSettings) => {
      if (!actor) throw new Error('Actor not available');
      return actor.savePlayerSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playerProfile'] });
    }
  });
}

export function useUpdateBestScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newScore: ScoreRecord) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBestScore(newScore);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playerProfile'] });
    }
  });
}
