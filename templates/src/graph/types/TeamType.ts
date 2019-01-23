import { ObjectType, Field, ID } from 'type-graphql';
import PlayerType from './PlayerType';

@ObjectType()
class TeamType {
  @Field(type => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  photo: string;

  @Field(type => PlayerType)
  captain: PlayerType;

  @Field(type => [PlayerType])
  players: PlayerType[];
}

export default TeamType;
