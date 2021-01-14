export interface AuthStateInterface {
  auth: boolean;
  user: UserInterface;
}

export interface UserInterface {
  id?: number;
  avatar?: string;
  created_at?: string;
  discord_nickname?: string;
  email?: string;
  isAdmin?: boolean;
  email_verified_at?: string;
  twitch_nickname?: string;
  updated_at?: string;
}

function state(): AuthStateInterface {
  return {
    auth: false,
    user: {
      id: undefined,
      avatar: undefined,
      created_at: undefined,
      discord_nickname: undefined,
      email: undefined,
      isAdmin: false,
      email_verified_at: undefined,
      twitch_nickname: undefined,
      updated_at: undefined,
    },
  }
};

export default state;
