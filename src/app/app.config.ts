import { Injectable } from '@angular/core';

@Injectable()
export class Config {
	public REST_TIMEOUT_DURATION = 3 * 1000;
	public WP_API_URL = 'https://stan.stevenimhof.ch/wp-json';
	public WP_MAX_POSTS = "per_page=100";
	public WP_INFO_PAGE_ID = 47;
	public WP_ABOUT_PAGE_ID = 124;
}