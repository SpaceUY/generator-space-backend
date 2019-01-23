import { Resolver, Query, Arg, Mutation, ResolverInterface, FieldResolver, Root } from 'type-graphql';
import TeamType from '../types/TeamType';
import Team from '../../models/definitions/Team';
import { TeamModel, PlayerModel } from '../../models';
import TeamInput, { TeamInputOptional } from '../inputs/TeamInput';
import PlayerType from '../types/PlayerType';
import { InstanceType } from 'typegoose';

@Resolver(TeamType)
class TeamResolver {
  @Query(returns => TeamType)
  async team(@Arg('id') id: string) {
    try {
      return await TeamModel.findById(id);
    } catch (e) {
      throw e;
    }
  }

  @Query(returns => [TeamType])
  async teams() {
    try {
      return await TeamModel.find({});
    } catch (e) {
      throw e;
    }
  }

  @Mutation(returns => TeamType)
  async addTeam(@Arg('team') team: TeamInput) {
    try {
      const newTeam = new TeamModel(team);
      return await newTeam.save();
    } catch (e) {
      throw e;
    }
  }

  @Mutation(returns => TeamType)
  async updateTeam(@Arg('id') id: string, @Arg('team') team: TeamInputOptional) {
    try {
      return await TeamModel.findAndUpdate(id, { $set: team });
    } catch (e) {
      throw e;
    }
  }

  @Mutation(returns => TeamType)
  async deleteTeam(@Arg('id') id: string) {
    try {
      return await TeamModel.findByIdAndDelete(id);
    } catch (e) {
      throw e;
    }
  }

  @Mutation(returns => TeamType)
  async addPlayerToTeam(@Arg('teamId') teamId: string, @Arg('playerId') playerId: string) {
    try {
      return await TeamModel.findAndUpdate(teamId, { $push: { players: playerId } });
    } catch (e) {
      throw e;
    }
  }

  @Mutation(returns => TeamType)
  async removePlayerFromTeam(@Arg('teamId') teamId: string, @Arg('playerId') playerId: string) {
    try {
      return await TeamModel.findAndUpdate(teamId, { $pull: { players: playerId } });
    } catch (e) {

    }
  }

  @FieldResolver()
  async captain(@Root() team: InstanceType<Team>): Promise<PlayerType> {
    try {
      return await PlayerModel.findById(team.captain) as PlayerType;
    } catch (e) {
      throw e;
    }
  }

  @FieldResolver()
  async players(@Root() team: InstanceType<Team>): Promise<PlayerType[]> {
    try {
      return await PlayerModel.find({ _id: { $in: team.players } }) as PlayerType[];
    } catch (e) {
      throw e;
    }
  }
}

export default TeamResolver;
