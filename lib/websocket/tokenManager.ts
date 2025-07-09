// tokenManager.ts
import { store } from "@/lib/redux/store";
import {
  logout,
  selectAccessToken,
  selectRefreshToken,
  setCredentials,
} from "@/lib/redux/slices/authSlice";
import { isTokenExpired } from "../utils/jwt";

class TokenManager {
  private isRefreshingToken = false;
  private tokenRefreshQueue: (() => void)[] = [];

  public async getValidToken(): Promise<string | null> {
    const currentToken = selectAccessToken(store.getState());

    if (currentToken && !isTokenExpired(currentToken)) {
      return currentToken;
    }

    if (this.isRefreshingToken) {
      return new Promise((resolve) => {
        this.tokenRefreshQueue.push(() => {
          resolve(selectAccessToken(store.getState()));
        });
      });
    }

    return await this.refreshToken();
  }

  private async refreshToken(): Promise<string | null> {
    this.isRefreshingToken = true;
    try {
      const refreshToken = selectRefreshToken(store.getState());
      if (!refreshToken) {
        store.dispatch(logout());
        return null;
      }

      const response = await fetch("/account/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) throw new Error("Token refresh failed");

      const data = await response.json();
      store.dispatch(
        setCredentials({
          accessToken: data.access,
          refreshToken: data.refresh || refreshToken,
        })
      );

      this.tokenRefreshQueue.forEach((cb) => cb());
      this.tokenRefreshQueue = [];

      return data.access;
    } catch (error) {
      console.error("Token refresh failed:", error);
      store.dispatch(logout());
      return null;
    } finally {
      this.isRefreshingToken = false;
    }
  }
}

export const tokenManager = new TokenManager();