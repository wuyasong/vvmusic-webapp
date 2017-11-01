{{each list as item}}
    <li data-id="{{item.linkUrl}}" data-title="{{item.title}}" data-src="{{item.CDNPicture}}">
        <p class="singer-cover" style="background-image:url({{item.CDNPicture}})"></p>
        <p class="singer-name">{{item.title}}</p>                            
    </li>
{{/each}}