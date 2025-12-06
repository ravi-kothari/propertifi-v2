/**
 * Docker Service Management Helpers for E2E Tests
 * 
 * Provides utilities to manage Docker services for testing
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class DockerHelpers {
  /**
   * Start Docker services for testing
   */
  static async startServices(): Promise<void> {
    try {
      const { stdout } = await execAsync(
        'cd ../../propertifi-backend && docker-compose -f docker-compose.test.yml up -d'
      );
      console.log('Test Docker services started:', stdout);
      
      // Wait for services to be ready
      await this.waitForServices();
    } catch (error) {
      console.error('Error starting Docker services:', error);
      throw error;
    }
  }

  /**
   * Stop Docker services for testing
   */
  static async stopServices(): Promise<void> {
    try {
      const { stdout } = await execAsync(
        'cd ../../propertifi-backend && docker-compose -f docker-compose.test.yml down'
      );
      console.log('Test Docker services stopped:', stdout);
    } catch (error) {
      console.error('Error stopping Docker services:', error);
      throw error;
    }
  }

  /**
   * Check if Docker services are running
   */
  static async checkServices(): Promise<boolean> {
    try {
      const { stdout } = await execAsync(
        'cd ../../propertifi-backend && docker-compose -f docker-compose.test.yml ps'
      );
      return stdout.includes('Up');
    } catch (error) {
      return false;
    }
  }

  /**
   * Wait for Docker services to be ready
   */
  static async waitForServices(maxWait: number = 30000): Promise<void> {
    const startTime = Date.now();
    const checkInterval = 2000;

    while (Date.now() - startTime < maxWait) {
      if (await this.checkServices()) {
        // Additional wait for services to be fully ready
        await new Promise(resolve => setTimeout(resolve, 5000));
        return;
      }
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }

    throw new Error('Docker services did not become ready in time');
  }

  /**
   * Reset test database
   */
  static async resetDatabase(): Promise<void> {
    try {
      // This would need to be implemented based on your Laravel setup
      // Could run: php artisan migrate:fresh --seed
      console.log('Database reset would be implemented here');
    } catch (error) {
      console.error('Error resetting database:', error);
      throw error;
    }
  }
}









