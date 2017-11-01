<ul class="carrousel-scroller">
    {{each list as item}}
        <li 
            class="carrousel-item">
            <a href="javascript:;" class="carrousel-link" style="background-image: url({{item.cover}})"></a>
        </li>
    {{/each}}
</ul>
<div class="indicator">
    <div class="indicator-list">
        {{each list}}
            {{if $index == 0}}
            <span class="current"></span>
            {{else}}
            <span></span>
            {{/if}}
        {{/each}}
    </div>
</div>