import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogService } from '../../../../core/services/blog.service';
import { BlogPost, BlogResponse } from '../../../../core/models/blog.model';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';

@Component({
    selector: 'app-blog-list',
    standalone: true,
    imports: [CommonModule, RouterModule, UiButtonComponent],
    templateUrl: './blog-list.component.html'
})
export class BlogListComponent implements OnInit {
    posts: BlogPost[] = [];
    loading = true;
    loadingMore = false;
    page = 1;
    hasMore = false;

    constructor(private blogService: BlogService) { }

    ngOnInit() {
        this.loadPosts();
    }

    loadPosts() {
        this.blogService.getBlogs(this.page).subscribe({
            next: (response: BlogResponse) => {
                if (this.page === 1) {
                    this.posts = response.data;
                } else {
                    this.posts = [...this.posts, ...response.data];
                }
                this.hasMore = response.meta.current_page < response.meta.last_page;
                this.loading = false;
                this.loadingMore = false;
            },
            error: (err: unknown) => {
                console.error('Error fetching blogs', err);
                this.loading = false;
                this.loadingMore = false;
            }
        });
    }

    loadMore() {
        this.loadingMore = true;
        this.page++;
        this.loadPosts();
    }
}
