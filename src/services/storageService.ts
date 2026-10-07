/**
 * PROMJA - Image Storage Service Abstraction
 * 
 * Keeps image storage cleanly separate from prompt metadata.
 * In production, this can be swapped with AWS S3, Cloudinary, Firebase Storage,
 * or Cloudflare Images by replacing the implementation of IStorageService.
 */

export interface IStorageService {
  uploadImage(file: File): Promise<{ url: string; size: number }>;
  validateImageUrl(url: string): Promise<boolean>;
  getCuratedPresets(): { name: string; url: string; category: string }[];
}

export class LocalClientStorageService implements IStorageService {
  async uploadImage(file: File): Promise<{ url: string; size: number }> {
    // Validate file size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Image size exceeds 10MB limit. Please compress or choose a smaller image.');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Selected file is not an image.');
    }

    // Convert file to optimized data URL for immediate client-side persistence
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve({ url: reader.result, size: file.size });
        } else {
          reject(new Error('Failed to read image file data.'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async validateImageUrl(url: string): Promise<boolean> {
    if (!url) return false;
    if (url.startsWith('data:image/')) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  getCuratedPresets(): { name: string; url: string; category: string }[] {
    return [
      {
        name: 'Cyberpunk Neon Street',
        url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
        category: 'Cinematic',
      },
      {
        name: 'Luxury Perfume Minimalist',
        url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80',
        category: 'Product',
      },
      {
        name: 'Avant-Garde High Fashion',
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
        category: 'Fashion',
      },
      {
        name: 'Master Horologist Close-up',
        url: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=1200&q=80',
        category: 'Portrait',
      },
      {
        name: 'Brutalist Concrete Pavilion',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        category: 'Architecture',
      },
      {
        name: 'FPV Autumn Mountain Mist',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        category: 'AI Video',
      },
      {
        name: 'Vintage 35mm Road Trip',
        url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
        category: 'Photography',
      },
      {
        name: 'Studio Ghibli Sky Islands',
        url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
        category: 'Anime',
      },
      {
        name: 'Bioluminescent Jellyfish',
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
        category: 'Aesthetic',
      },
      {
        name: 'Surrealist Desert Structure',
        url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
        category: 'AI Images',
      },
    ];
  }
}

export const storageService: IStorageService = new LocalClientStorageService();
