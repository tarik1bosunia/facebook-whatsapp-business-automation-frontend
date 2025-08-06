# Facebook Integration Guide

This guide outlines the steps to integrate your application with Facebook, allowing you to manage Facebook App ID, App Secret, Long-Lived Access Token, and Verify Token.

## Overview

The Facebook integration process involves setting up your Facebook App ID and App Secret, obtaining a short-lived user access token to generate a long-lived page access token, and setting up a verify token for webhook validation.

## Configuration Steps

### 1. Set Facebook App ID and App Secret

If the Facebook App ID and App Secret are not set, or if you wish to reset them, input the values in the provided fields and click "Submit App ID and Secret". For security, the App Secret field has a toggleable eye icon to show or hide the input.

### 2. Generate and Save Long-Lived Page Access Token

Once the App ID and App Secret are set, you will be prompted to provide a short-lived user access token. This token will be used to generate and save a long-lived page access token in the backend database. Input your short-lived token and click "Submit Short-lived Token". The short-lived token field also has a toggleable eye icon for visibility.

### 3. Set Verify Token

After the long-lived access token is set, you will need to set a verify token. This token is crucial for Facebook webhook validation. Input your desired verify token and click "Submit Verify Token". The verify token field has a toggleable eye icon for visibility.

## Connection Status

The "Connect" button will be enabled only when both the Long-Lived Access Token and Verify Token are successfully set. Clicking "Connect" will establish the integration.

If you need to disconnect the integration, a "Disconnect" button will be available when connected.

## Permissions

When connected, you can manage permissions such as "Auto Replies" and "Notifications" using the provided switches.