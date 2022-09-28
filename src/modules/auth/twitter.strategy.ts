import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-twitter';
import { env } from 'process';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor() {
    super({
      consumerKey: env.TWITTER_CONSUMER_KEY,
      consumerSecret: env.TWITTER_CONSUMER_SECRET,
      callbackURL: env.TWITTER_CALLBACK_URL,
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

    console.log(profile, "PROFILE");
    
    const user = {  
      name: displayName,
      email: profile._json.email,
      avatar: profile._json.profile_image_url.replace(/_normal\./, '.'),
      username: username,
      provider: provider,
      followers: profile._json.followers_count,
      following: profile._json.friends_count
    };

    done(null, user);
  }
}
