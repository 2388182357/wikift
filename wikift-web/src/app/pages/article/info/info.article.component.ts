/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ArticleModel } from '../../../../app/shared/model/article/article.model';
import { UserModel } from '../../../../app/shared/model/user/user.model';
import { ArticleService } from '../../../../services/article.service';
import { CommonResultModel } from '../../../shared/model/result/result.model';
import { CookieUtils } from '../../../shared/utils/cookie.util';
import { CommonConfig } from '../../../../config/common.config';
import { ArticleFabulousParamModel } from '../../../shared/model/param/article.fabulous.param.model';

@Component({
    selector: 'wikift-article-info',
    templateUrl: 'info.article.component.html'
})

export class InfoArticleComponent implements OnInit {

    // 当前登录的用户
    currentUser;
    // 文章id
    id: number;
    // 文章内容
    public article: ArticleModel;
    // 是否可赞状态
    fabulousStatus = true;

    constructor(private route: ActivatedRoute,
        private articleService: ArticleService) {
        // 获取页面url传递的id参数
        this.route.params.subscribe((params) => this.id = params.id);
    }

    ngOnInit() {
        this.initArticleInfo();
    }

    initArticleInfo() {
        if (CookieUtils.getBy(CommonConfig.AUTH_USER_INFO)) {
            this.currentUser = JSON.parse(CookieUtils.getBy(CommonConfig.AUTH_USER_INFO));
        }
        const params = new ArticleModel();
        params.id = this.id;
        this.articleService.info(params).subscribe(
            result => {
                this.article = result.data;
                this.initFabulousStatus();
            }
        );
    }

    initFabulousStatus() {
        const fabulous = new ArticleFabulousParamModel();
        fabulous.userId = this.article.userEntity.id;
        fabulous.articleId = this.article.id;
        this.articleService.fabulousCheck(fabulous).subscribe(
            result => {
                if (result.data > 0) {
                    this.fabulousStatus = false;
                }
            }
        );
    }

    fabulous() {
        const fabulous = new ArticleFabulousParamModel();
        fabulous.userId = this.article.userEntity.id;
        fabulous.articleId = this.article.id;
        this.articleService.fabulous(fabulous).subscribe(
            result => {
                this.fabulousStatus = false;
            }
        );
    }

    unFabulous() {
        const fabulous = new ArticleFabulousParamModel();
        fabulous.userId = this.article.userEntity.id;
        fabulous.articleId = this.article.id;
        this.articleService.unfabulous(fabulous).subscribe(
            result => {
                this.fabulousStatus = true;
            }
        );
    }

}