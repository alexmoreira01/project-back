import { Replace } from '../../helpers/Replace';
import { randomUUID } from 'crypto';

export interface TeamProps {
  name: string;
  code: string;
  adminId: number;
  description?: string | null;
  createdAt: Date;
  updatedAt?: Date;
}

export class Team {
  private _id: string;
  private props: TeamProps;

  constructor(
    props: Replace<TeamProps, { createdAt?: Date; updatedAt?: Date }>,
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

  public set name(name: string) {
    this.props.name = name;
  }

  public get name(): string {
    return this.props.name;
  }

  public set code(code: string) {
    this.props.code = code;
  }

  public get code(): string {
    return this.props.code;
  }

  public set adminId(adminId: number) {
    this.props.adminId = adminId;
  }

  public get adminId(): number {
    return this.props.adminId;
  }

  public set description(description: string | null) {
    this.props.description = description;
  }

  public get description(): string | null | undefined {
    return this.props.description;
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

  public static generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  public isAdminUser(userId: number): boolean {
    return this.props.adminId === userId;
  }

  public changeAdmin(newAdminId: number) {
    this.props.adminId = newAdminId;
    this.touch();
  }

  public updateInfo(name?: string, description?: string) {
    if (name) this.props.name = name;
    if (description !== undefined) this.props.description = description;
    this.touch();
  }
}