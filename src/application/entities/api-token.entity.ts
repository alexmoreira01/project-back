import { Replace } from '../../helpers/Replace';
import { randomUUID } from 'crypto';

export interface ApiTokenProps {
  token: string;
  userId: string;
  name: string | null;
  expiresAt: Date | null;
  revoked: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export class ApiToken {
  private _id: string;
  private props: ApiTokenProps;

  constructor(
    props: Replace<ApiTokenProps, { createdAt?: Date; updatedAt?: Date; revoked?: boolean }>,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      revoked: props.revoked ?? false,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  public get id(): string {
    return this._id;
  }

  public get token(): string {
    return this.props.token;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public get name(): string | null {
    return this.props.name;
  }

  public get expiresAt(): Date | null {
    return this.props.expiresAt;
  }

  public get revoked(): boolean {
    return this.props.revoked;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  public revoke(): void {
    this.props.revoked = true;
    this.touch();
  }

  public isExpired(): boolean {
    if (!this.props.expiresAt) return false;
    return this.props.expiresAt < new Date();
  }

  public isValid(): boolean {
    return !this.props.revoked && !this.isExpired();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}