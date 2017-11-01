{{each list as item}}
    <section>
        <header class="rankinglist-header">{{item.title}}</header>
        <div class="rankinglist-box" 
            data-songMenuID="{{ item.songMenuID }}" 
            data-title="{{ item.title }}" 
            data-picture="{{ item.CDNPicture }}" 
            data-headPicture="{{ item.CDNHeadPicture }}">
            <div class="rankinglist-cover" style="background-image:url({{item.CDNPicture}})"></div>
            <ul class="rankinglist-list">
                {{each item.brief.split('/') as songName index}}
                <li>
                    <span class="rankinglist-number">{{index + 1}}</span>
                    <span class="rankinglist-songname">{{songName}}</span>
                </li>
                {{/each}}
            </ul>
            <div class="rankinglist-arrow">
                <i class="arrow-icon"></i>
            </div>
        </div>
    </section>
{{/each}}