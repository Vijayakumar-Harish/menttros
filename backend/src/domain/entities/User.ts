export type UserRole = "LEARNER" | "MENTOR" | "ADMIN";

export interface UserProps {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
    this.props = props;
  }

  get id() {
    return this.props.id;
  }

  get email() {
    return this.props.email;
  }

  get name() {
    return this.props.name;
  }

  get role() {
    return this.props.role;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
