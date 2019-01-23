import { Typegoose, prop } from 'typegoose';

enum Role {
  CAPTAIN = 'captain',
  PLAYER = 'player',
}

class Player extends Typegoose {
  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ required: true, min: 15 })
  age: number;

  @prop({ required: true })
  photo: string;

  @prop({ required: true, enum: Role })
  role: Role;
}

export default Player;
