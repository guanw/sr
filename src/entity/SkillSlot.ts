import * as PIXI from "pixi.js";
import { GAME_WINDOW_SIZE } from "../utils/Constants";
import { ResourceLoader, SKILL_SLOT_MAGIC_ASSET } from "../ResourceLoader";
import { Logger } from "../utils/Logger";

const SKILL_COOLDOWN_TIME = 3000; // Cooldown time in milliseconds
const RADIUS = 35;
const SKILL_LENGTH = 4;

interface Skill {
  icon: PIXI.Sprite;
  cooldownOverlay: PIXI.Graphics;
  lastUsed: number; // Timestamp of the last usage
  cooldownTime: number; // Cooldown duration
}

export default class SkillSlot {
  private static instance: SkillSlot;
  private container: PIXI.Container;
  private skills: Skill[] = [];

  constructor(layer: PIXI.Container) {
    this.container = new PIXI.Container();
    this.container.x = GAME_WINDOW_SIZE / 2 - 100;
    this.container.y = (GAME_WINDOW_SIZE * 3.0) / 4 + 50;

    layer.addChild(this.container);
  }

  public static async genInstance(
    stage: PIXI.Container | null = null
  ): Promise<SkillSlot> {
    if (!SkillSlot.instance && stage != null) {
      SkillSlot.instance = new SkillSlot(stage);
      // TODO use different icon to render skill slots
      await SkillSlot.instance.genAddSkill();
      await SkillSlot.instance.genAddSkill();
      await SkillSlot.instance.genAddSkill();
      await SkillSlot.instance.genAddSkill();
    }
    return SkillSlot.instance;
  }

  private async genAddSkill() {
    if (this.skills.length > SKILL_LENGTH) return;
    const resourceLoader = await ResourceLoader.genInstance();
    const texture = resourceLoader.getResource(SKILL_SLOT_MAGIC_ASSET);

    const boundary = new PIXI.Graphics();
    boundary.lineStyle(4, 0xdddddd, 0.7);
    boundary.beginFill(0xdddddd);
    boundary.drawCircle(RADIUS / 2, RADIUS / 2, 23);
    boundary.endFill();

    const skillIcon = new PIXI.Sprite(texture);
    skillIcon.width = RADIUS;
    skillIcon.height = RADIUS;
    skillIcon.x = this.skills.length * 60;

    // Create the cooldown overlay as a circular arc
    const cooldownOverlay = new PIXI.Graphics();
    cooldownOverlay.position.set(
      skillIcon.x + skillIcon.width / 2,
      skillIcon.height / 2
    );

    // Position and add skill icon and overlay to the container
    const skill = {
      icon: skillIcon,
      cooldownOverlay,
      lastUsed: 0,
      cooldownTime: SKILL_COOLDOWN_TIME,
    };

    boundary.position.set(skillIcon.x, skillIcon.y);
    this.container.addChild(boundary);
    this.container.addChild(skillIcon);
    this.container.addChild(cooldownOverlay);
    this.skills.push(skill);
  }

  public triggerSkill(index: number) {
    if (index >= SKILL_LENGTH) {
      return;
    }
    const skill = this.skills[index];
    const currentTime = Date.now();

    const logger = Logger.getInstance();
    if (currentTime - skill.lastUsed >= skill.cooldownTime) {
      logger.log(`Triggered skill ${index + 1}`);
      skill.lastUsed = currentTime;
    } else {
      logger.log(`Skill ${index + 1} is on cooldown`);
    }
  }

  public updateCooldowns() {
    const currentTime = Date.now();

    this.skills.forEach((skill) => {
      const timeElapsed = currentTime - skill.lastUsed;
      if (timeElapsed < skill.cooldownTime) {
        const cooldownProgress = timeElapsed / skill.cooldownTime;
        const angle = Math.PI * 2 * (1 - cooldownProgress);

        // Draw the circular cooldown effect
        skill.cooldownOverlay.clear();
        skill.cooldownOverlay.beginFill(0x000000, 0.5);
        skill.cooldownOverlay.moveTo(0, 0); // Center point of the arc
        skill.cooldownOverlay.arc(
          0,
          0,
          25,
          -Math.PI / 2,
          angle - Math.PI / 2,
          true
        );
        skill.cooldownOverlay.lineTo(0, 0);
        skill.cooldownOverlay.endFill();
      } else {
        skill.cooldownOverlay.clear(); // Hide cooldown overlay
      }
    });
  }
}
