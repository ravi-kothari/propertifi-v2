import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BlogService } from '../../../../core/services/blog.service';
import { BlogPost } from '../../../../core/models/blog.model';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';

@Component({
    selector: 'app-blog-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, UiButtonComponent],
    templateUrl: './blog-detail.component.html'
})
export class BlogDetailComponent implements OnInit {
    post: BlogPost | null = null;
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private blogService: BlogService
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const slug = params.get('slug');
            if (slug) {
                this.loadPost(slug);
            }
        });
    }

    loadPost(slug: string) {
        this.loading = true;
        this.blogService.getBlogBySlug(slug).subscribe({
            next: (post: BlogPost) => {
                this.post = post;
                this.loading = false;
            },
            error: (err: unknown) => {
                console.error('Error fetching blog post', err);
                this.loading = false;
            }
        });
    }
}
