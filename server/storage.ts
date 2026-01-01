import { db } from "./db";
import {
  profiles,
  type Profile,
  type InsertProfile,
} from "@shared/schema";
import { eq, and, gte, lte, ilike } from "drizzle-orm";

export interface IStorage {
  getProfiles(filters?: {
    gender?: string;
    denomination?: string;
    minAge?: number;
    maxAge?: number;
    location?: string;
  }): Promise<Profile[]>;
  getProfile(id: number): Promise<Profile | undefined>;
  getProfileByUserId(userId: string): Promise<Profile | undefined>;
  createProfile(userId: string, profile: InsertProfile): Promise<Profile>;
  updateProfile(id: number, updates: Partial<InsertProfile>): Promise<Profile>;
  deleteProfile(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getProfiles(filters?: {
    gender?: string;
    denomination?: string;
    minAge?: number;
    maxAge?: number;
    location?: string;
  }): Promise<Profile[]> {
    const conditions = [];

    if (filters?.gender) {
      conditions.push(eq(profiles.gender, filters.gender));
    }
    if (filters?.denomination) {
      conditions.push(ilike(profiles.denomination, `%${filters.denomination}%`));
    }
    if (filters?.location) {
      conditions.push(ilike(profiles.location, `%${filters.location}%`));
    }
    if (filters?.minAge) {
      conditions.push(gte(profiles.age, filters.minAge));
    }
    if (filters?.maxAge) {
      conditions.push(lte(profiles.age, filters.maxAge));
    }

    if (conditions.length === 0) {
      return await db.select().from(profiles);
    }

    return await db.select().from(profiles).where(and(...conditions));
  }

  async getProfile(id: number): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.id, id));
    return profile;
  }

  async getProfileByUserId(userId: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile;
  }

  async createProfile(userId: string, profile: InsertProfile): Promise<Profile> {
    const [newProfile] = await db
      .insert(profiles)
      .values({ ...profile, userId })
      .returning();
    return newProfile;
  }

  async updateProfile(id: number, updates: Partial<InsertProfile>): Promise<Profile> {
    const [updated] = await db
      .update(profiles)
      .set(updates)
      .where(eq(profiles.id, id))
      .returning();
    return updated;
  }

  async deleteProfile(id: number): Promise<void> {
    await db.delete(profiles).where(eq(profiles.id, id));
  }
}

export const storage = new DatabaseStorage();
