import { Typegoose, prop, ModelType, InstanceType, instanceMethod, staticMethod } from 'typegoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

class User extends Typegoose {
  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ default: false })
  isAdmin: boolean = false;

  @prop({ required: true })
  username: string;

  @prop({
    required: true,
    unique: true,
    validate: {
      validator: val => isEmail(val),
      message: '{VALUE} is not a valid email',
    },
  })
  email: string;

  @prop()
  password?: string;

  @instanceMethod
  async generateHash(this: InstanceType<User>, password: string) {
    try {
      const hash = await bcrypt.hash(password, 8);
      this.password = hash;
      return;
    } catch (e) {
      throw e;
    }
  }

  @instanceMethod
  async checkPassword(this: InstanceType<User>, password: string) {
    try {
      return await bcrypt.compare(password, this.password as string);
    } catch (e) {
      throw e;
    }
  }

  @instanceMethod
  getJWT(this: InstanceType<User>): string {
    try {
      return jwt.sign(
        {
          id: this._id,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: '30d',
        },
      );
    } catch (e) {
      throw e;
    }
  }

  @instanceMethod
  getUserSafe(this: InstanceType<User>) {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
      isAdmin: this.isAdmin,
    };
  }
}

function isEmail(val: string) {
  return /\S+@\S+\.\S+/.test(val);
}

export default User;
