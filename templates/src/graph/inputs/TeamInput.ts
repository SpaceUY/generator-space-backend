import { InputType, Field, ID, Int } from 'type-graphql';

import TeamType from '../types/TeamType';
import PlayerInput from './PlayerInput';
import PlayerType from '../types/PlayerType';

@InputType()
class TeamInput {
  @Field()
  name: string;

  @Field()
  photo: string;

  @Field()
  captain: string;
}

@InputType()
export class TeamInputOptional {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  photo: string;

  @Field({ nullable: true })
  captain: string;
}

export default TeamInput;
