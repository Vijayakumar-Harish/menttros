export interface SkillProps {
  id: string;
  name: string;
  description: string;
}

export class Skill {
  constructor(private props: SkillProps) {}

  get id() {
    return this.props.id;
  }
  get name() {
    return this.props.name;
  }
  get description() {
    return this.props.description;
  }
}
