import { Replace } from '../../helpers/Replace';
import { randomUUID } from 'crypto';

export enum UserType {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface UserProps {
  email: string;
  name: string;
  password: string;
  userType: UserType;
  teamId?: number | null;
  createdAt: Date;
  updatedAt?: Date;
}

export class User {
  private _id: string;
  private props: UserProps;

  constructor(
    props: Replace<UserProps, { createdAt?: Date; updatedAt?: Date }>,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  public get id(): string {
    return this._id;
  }

  public set email(email: string) {
    this.props.email = email;
  }

  public get email(): string {
    return this.props.email;
  }

  public set name(name: string) {
    this.props.name = name;
  }

  public get name(): string {
    return this.props.name;
  }

  public set password(password: string) {
    this.props.password = password;
  }

  public get password(): string {
    return this.props.password;
  }

  public set userType(userType: UserType) {
    this.props.userType = userType;
  }

  public get userType(): UserType {
    return this.props.userType;
  }

  public set teamId(teamId: number | null) {
    this.props.teamId = teamId;
  }

  public get teamId(): number | null | undefined {
    return this.props.teamId;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  public touch() {
    this.props.updatedAt = new Date();
  }

  public isAdmin(): boolean {
    return this.props.userType === UserType.ADMIN;
  }

  public belongsToTeam(): boolean {
    return this.props.teamId !== null && this.props.teamId !== undefined;
  }

  public joinTeam(teamId: number) {
    this.props.teamId = teamId;
    this.touch();
  }

  public leaveTeam() {
    this.props.teamId = null;
    this.touch();
  }
}