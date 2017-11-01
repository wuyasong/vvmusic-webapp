{{each list as item}}
    <li 
        data-songMenuID="{{ item.songMenuID }}" 
        data-title="{{ item.title }}" 
        data-picture="{{ item.CDNPicture }}" 
        data-headPicture="{{ item.CDNHeadPicture }}">
        <p class="songlist-cover" style="background-image:url({{item.CDNPicture}});height:{{item.pic_screen_height}}px"></p>
        <p class="songlist-info">
            <a href="javascript:;" class="songlist-info-txt">{{ item.title }}</a>
            <a href="javascript:;" class="songlist-data">
                <span class="songlist-data-item">
                    <i class="songlist-play-icon"></i>
                    <b class="songlist-data-count">{{ item.playNum }}</b>
                </span>
                <span class="songlist-data-item">
                    <i class="songlist-like-icon"></i>
                    <b class="songlist-data-count">{{ item.collectNum }}</b>
                </span>
            </a>
        </p>
    </li>
{{/each}}