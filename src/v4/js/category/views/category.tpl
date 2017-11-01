<section class="category">
    <aside class="category-theme">
        <i class="category-icon" style="background-image:url({{nav.CDNIconLink1}})"></i>
        <p class="category-title">{{nav.name}}</p>
    </aside>
    <nav>
        <ul class="category-list">
            {{each list as item}}
                <li 
                    data-categoryID="{{ item.categoryID }}" 
                    data-title="{{ item.name }}" 
                    data-url1="{{ item.CDNIconLink }}" 
                    data-url2="{{ item.CDNIconLink1 }}">
                    {{if item.isHot == 1}}<i class="category-hot-icon"></i>{{/if}}{{item.name}}
                </li>
            {{/each}}
        </ul>
    </nav>
</section>