import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-twitter';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor() {

    super({
    consumerKey:'ZN8BasIATQM1lFfimzWuJ96sQ',
    consumerSecret: 'Dhwiqplweoq1YedgH19qrYK2LTODezvvOvuDbI57N4SY8cVQ4g',
    callbackURL: `http://localhost:3017/auth/twitter/redirect`,
    includeEmail: true
    // scope: 'email',
    // profileFields: ['emails', 'name', 'username'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { displayName, emails, photos, provider,username } = profile;

    const user = {  
      name: displayName,
      email: emails[0].value,
      avatar: photos[0].value.replace(/_normal\./, '.'),
      username: username,
      provider: provider,
    //   followers: followers_count,
    //   following: friends_count
    };

    done(null, user);
  }
}
