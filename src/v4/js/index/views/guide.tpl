<ul class="guide-list">
    {{each list as item}}
        <li 
            style="background-image: url({{item.CDNPicture}})"
            data-src="{{item.CDNPicture}}"
            data-type="{{item.linkType}}"
            data-adID="{{item.adID}}"
            data-title="{{item.title}}"
            data-headPic="{{item.CDNPicture}}"
            data-linkUrl="{{item.linkUrl}}">
            <!-- <p>{{item.title}}</p> -->
        </li>
    {{/each}}
</ul>