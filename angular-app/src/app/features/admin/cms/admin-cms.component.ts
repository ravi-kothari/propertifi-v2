import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { BlogPost, Faq } from '../../../core/models/admin.model';
import { UiCardComponent } from '../../../shared/components/ui-card/ui-card.component';
import { UiButtonComponent } from '../../../shared/components/ui-button/ui-button.component';
import { UiBadgeComponent } from '../../../shared/components/ui-badge/ui-badge';

@Component({
    selector: 'app-admin-cms',
    standalone: true,
    imports: [CommonModule, UiCardComponent, UiButtonComponent, UiBadgeComponent],
    templateUrl: './admin-cms.component.html'
})
export class AdminCmsComponent implements OnInit {
    private adminService = inject(AdminService);

    activeTab: 'blogs' | 'faqs' = 'blogs';
    blogs: BlogPost[] = [];
    faqs: Faq[] = [];

    ngOnInit() {
        // Mock data
        this.blogs = [
            {
                id: 1,
                title: 'Getting Started with Propertifi',
                slug: 'getting-started',
                content: '...',
                excerpt: 'Learn the basics...',
                author_name: 'Admin',
                status: 'published',
                category_id: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ];

        this.faqs = [
            {
                id: 1,
                question: 'How do I reset my password?',
                answer: 'Go to settings...',
                category: 'Account',
                order: 1,
                is_published: true
            }
        ];

        /* Uncomment when API is ready
        this.loadData();
        */
    }

    loadData() {
        this.adminService.getBlogs().subscribe((response: { data: BlogPost[] }) => this.blogs = response.data);
        this.adminService.getFaqs().subscribe((response: { data: Faq[] }) => this.faqs = response.data);
    }

    onCreate() {
        console.log('Create new item for', this.activeTab);
    }
}
