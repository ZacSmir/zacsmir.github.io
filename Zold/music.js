const albums = [
            {
                title: "Abbey Road",
                artist: "The Beatles",
                cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23E8E8E8'/%3E%3Cpath d='M15 135h120v-15H15z' fill='%23333'/%3E%3Ctext x='75' y='75' text-anchor='middle' font-family='Arial' font-size='14' fill='%23333'%3EAbbey Road%3C/text%3E%3Ctext x='75' y='90' text-anchor='middle' font-family='Arial' font-size='10' fill='%23666'%3EThe Beatles%3C/text%3E%3C/svg%3E",
                tracks: [
                    { name: "Come Together", time: "4:19", genre: "Rock" },
                    { name: "Something", time: "3:03", genre: "Rock" },
                    { name: "Maxwell's Silver Hammer", time: "3:27", genre: "Rock" },
                    { name: "Oh! Darling", time: "3:26", genre: "Rock" },
                    { name: "Here Comes the Sun", time: "3:05", genre: "Rock" }
                ],
                review: {
                    rating: 4,
                    text: "well the years went by and the rock just died"
                }
            },
            {
                title: "Abbey Road 1",
                artist: "The Beatles",
                cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23E8E8E8'/%3E%3Cpath d='M15 135h120v-15H15z' fill='%23333'/%3E%3Ctext x='75' y='75' text-anchor='middle' font-family='Arial' font-size='14' fill='%23333'%3EAbbey Road%3C/text%3E%3Ctext x='75' y='90' text-anchor='middle' font-family='Arial' font-size='10' fill='%23666'%3EThe Beatles%3C/text%3E%3C/svg%3E",
                tracks: [
                    { name: "Come Together", time: "4:19", genre: "Rock" },
                    { name: "Something", time: "3:03", genre: "Rock" },
                    { name: "Maxwell's Silver Hammer", time: "3:27", genre: "Rock" },
                    { name: "Oh! Darling", time: "3:26", genre: "Rock" },
                    { name: "Here Comes the Sun", time: "3:05", genre: "Rock" }
                ]
            },
            {
                title: "Abbey Road 2",
                artist: "The Beatles",
                cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23E8E8E8'/%3E%3Cpath d='M15 135h120v-15H15z' fill='%23333'/%3E%3Ctext x='75' y='75' text-anchor='middle' font-family='Arial' font-size='14' fill='%23333'%3EAbbey Road%3C/text%3E%3Ctext x='75' y='90' text-anchor='middle' font-family='Arial' font-size='10' fill='%23666'%3EThe Beatles%3C/text%3E%3C/svg%3E",
                tracks: [
                    { name: "Come Together", time: "4:19", genre: "Rock" },
                    { name: "Something", time: "3:03", genre: "Rock" },
                    { name: "Maxwell's Silver Hammer", time: "3:27", genre: "Rock" },
                    { name: "Oh! Darling", time: "3:26", genre: "Rock" },
                    { name: "Here Comes the Sun", time: "3:05", genre: "Rock" }
                ]
            },
            {
                title: "Dark Side of the Moon",
                artist: "Pink Floyd",
                cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23000'/%3E%3Cpath d='M37.5 75 L75 60 L75 90 Z' fill='%23FFF'/%3E%3Cpath d='M75 75 L112.5 67.5 L112.5 82.5 Z' fill='%23FF0080'/%3E%3Ctext x='75' y='120' text-anchor='middle' font-family='Arial' font-size='10' fill='%23FFF'%3EDark Side%3C/text%3E%3C/svg%3E",
                tracks: [
                    { name: "Speak to Me", time: "1:30", genre: "Progressive Rock" },
                    { name: "Breathe", time: "2:43", genre: "Progressive Rock" },
                    { name: "Time", time: "6:53", genre: "Progressive Rock" },
                    { name: "Money", time: "6:23", genre: "Progressive Rock" },
                    { name: "Brain Damage", time: "3:49", genre: "Progressive Rock" }
                ]
            },
            {
                title: "Aja",
                artist: "Steely Dan",
                cover: "./AlbumCovers/Aja.jpeg",
                tracks: [
                    { name: "Peg", time: "3:37", genre: "Rock" },
                    { name: "Peg", time: "3:37", genre: "Rock" },
                    { name: "Peg", time: "3:37", genre: "Rock" },
                    { name: "Peg", time: "3:37", genre: "Rock" },
                    { name: "Peg", time: "3:37", genre: "Rock" },
                    { name: "Peg", time: "3:37", genre: "Rock" }
                ],
                review: {
                    rating: 4.5,
                    text: " well the years went by and the rock just died Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ante metus, facilisis sed mollis nec, tempor eget est. Sed eget tincidunt ex. Sed luctus nibh vel lorem euismod elementum. Vestibulum rutrum consectetur orci ut sodales. Morbi ac fermentum orci. Cras porttitor dapibus nisi, nec egestas nisl malesuada ut. Aliquam porttitor velit eget orci cursus, vel faucibus enim venenatis. Aenean consectetur arcu scelerisque justo feugiat, consectetur pulvinar nibh porttitor. In iaculis non justo posuere blandit. Suspendisse bibendum volutpat ante, vel lacinia leo mollis quis. Aliquam fringilla nec nisi at vestibulum. Sed et lorem ullamcorper, varius diam vitae, maximus ex. Morbi lobortis, urna pulvinar gravida auctor, dolor nulla ullamcorper odio, vel eleifend nulla eros a ante. In pellentesque ultrices libero, sodales cursus enim. Aliquam sed nibh fermentum quam vehicula commodo nec nec dui. Nulla ultrices nibh venenatis lectus luctus, id interdum sem finibus. In molestie egestas auctor. Praesent dignissim et nisl at dapibus. Etiam ut leo libero. Integer nunc dui, commodo id libero venenatis, iaculis vestibulum metus. Nunc venenatis luctus turpis eget elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur vel orci nec odio rutrum bibendum non nec sapien. Proin viverra urna nec justo pharetra lobortis. Aenean enim metus, sodales vel risus ac, bibendum euismod nunc. Nam pulvinar tellus et neque maximus, iaculis porta est luctus. Duis placerat turpis euismod orci placerat, ac accumsan velit tincidunt. Quisque porta nisi egestas nulla sodales porta. Praesent eleifend sodales dui at feugiat. Fusce ac tincidunt neque, rhoncus tempor massa. Morbi at urna ut urna scelerisque tincidunt. Praesent vitae interdum augue. Morbi libero justo, tincidunt a interdum nec, accumsan eget purus. Nunc imperdiet, diam non sodales tempor, tellus neque varius neque, at interdum neque dolor tincidunt ligula. Curabitur sit amet ultricies mauris, tempor porttitor dui. Fusce accumsan eget elit lacinia dapibus. Maecenas malesuada ex odio, in congue quam viverra eu. In auctor libero vitae mauris maximus pretium. Curabitur in faucibus quam, non pharetra urna. Nunc tincidunt, quam a suscipit fringilla, quam metus tincidunt erat, in semper neque lacus a risus. Maecenas finibus dolor egestas ipsum rhoncus, sed mattis dolor ullamcorper. Ut blandit, eros eu imperdiet egestas, augue lacus finibus nulla, id rutrum dolor leo nec ante. Suspendisse aliquet mollis nulla tincidunt eleifend. Nullam eu nisi dictum, congue urna nec, consequat est. Sed quis risus a est blandit placerat. Suspendisse rhoncus ante metus, ac euismod sapien bibendum non. Duis cursus, tortor eget malesuada posuere, arcu felis molestie tellus, eget iaculis lacus lectus nec nibh. Nunc ut scelerisque lectus. Donec ultrices, nulla at vestibulum venenatis, ipsum purus feugiat dui, nec gravida lacus quam sit amet mi. Maecenas laoreet cursus urna, eu malesuada lacus bibendum in. Integer sit amet nisl eu mauris rutrum congue eget ut lacus. Vestibulum convallis odio vitae feugiat facilisis. Aenean ut nulla scelerisque, placerat risus id, consectetur nisi. Mauris in dolor laoreet, tristique risus ut, accumsan lorem. Donec suscipit interdum ex, sit amet fringilla odio pellentesque id. Ut vel lacus ut dolor interdum elementum porttitor eget risus. Donec justo dolor, pellentesque ac aliquam sed, euismod id neque. Fusce imperdiet hendrerit congue. Praesent eget nulla eu sapien tempus fringilla. Morbi arcu enim, posuere nec ligula non, tristique tincidunt mauris. Sed sollicitudin ante in vestibulum scelerisque. Aliquam et rutrum arcu, at convallis nisi. Donec sit amet lorem nec ante sagittis pharetra vel a mauris. Aenean ullamcorper massa id elit laoreet, non scelerisque ex sodales. Aliquam porttitor justo massa, sed interdum massa ultrices at. ears went by and the rock just died Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ante metus, facilisis sed mollis nec, tempor eget est. Sed eget tincidunt ex. Sed luctus nibh vel lorem euismod elementum. Vestibulum rutrum consectetur orci ut sodales. Morbi ac fermentum orci. Cras porttitor dapibus nisi, nec egestas nisl malesuada ut. Aliquam porttitor velit eget orci cursus, vel faucibus enim venenatis. Aenean consectetur arcu scelerisque justo feugiat, consectetur pulvinar nibh porttitor. In iaculis non justo posuere blandit. Suspendisse bibendum volutpat ante, vel lacinia leo mollis quis. Aliquam fringilla nec nisi at vestibulum. Sed et lorem ullamcorper, varius diam vitae, maximus ex. Morbi lobortis, urna pulvinar gravida auctor, dolor nulla ullamcorper odio, vel eleifend nulla eros a ante. In pellentesque ultrices libero, sodales cursus enim. Aliquam sed nibh fermentum quam vehicula commodo nec nec dui. Nulla ultrices nibh venenatis lectus luctus, id interdum sem finibus. In molestie egestas auctor. Praesent dignissim et nisl at dapibus. Etiam ut leo libero. Integer nunc dui, commodo id libero venenatis, iaculis vestibulum metus. Nunc venenatis luctus turpis eget elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur vel orci nec odio rutrum bibendum non nec sapien. Proin viverra urna nec justo pharetra lobortis. Aenean enim metus, sodales vel risus ac, bibendum euismod nunc. Nam pulvinar tellus et neque maximus, iaculis porta est luctus. Duis placerat turpis euismod orci placerat, ac accumsan velit tincidunt. Quisque porta nisi egestas nulla sodales porta. Praesent eleifend sodales dui at feugiat. Fusce ac tincidunt neque, rhoncus tempor massa. Morbi at urna ut urna scelerisque tincidunt. Praesent vitae interdum augue. Morbi libero justo, tincidunt a interdum nec, accumsan eget purus. Nunc imperdiet, diam non sodales tempor, tellus neque varius neque, at interdum neque dolor tincidunt ligula. Curabitur sit amet ultricies mauris, tempor porttitor dui. Fusce accumsan eget elit lacinia dapibus. Maecenas malesuada ex odio, in congue quam viverra eu. In auctor libero vitae mauris maximus pretium. Curabitur in faucibus quam, non pharetra urna. Nunc tincidunt, quam a suscipit fringilla, quam metus tincidunt erat, in semper neque lacus a risus. Maecenas finibus dolor egestas ipsum rhoncus, sed mattis dolor ullamcorper. Ut blandit, eros eu imperdiet egestas, augue lacus finibus nulla, id rutrum dolor leo nec ante. Suspendisse aliquet mollis nulla tincidunt eleifend. Nullam eu nisi dictum, congue urna nec, consequat est. Sed quis risus a est blandit placerat. Suspendisse rhoncus ante metus, ac euismod sapien bibendum non. Duis cursus, tortor eget malesuada posuere, arcu felis molestie tellus, eget iaculis lacus lectus nec nibh. Nunc ut scelerisque lectus. Donec ultrices, nulla at vestibulum venenatis, ipsum purus feugiat dui, nec gravida lacus quam sit amet mi. Maecenas laoreet cursus urna, eu malesuada lacus bibendum in. Integer sit amet nisl eu mauris rutrum congue eget ut lacus. Vestibulum convallis odio vitae feugiat facilisis. Aenean ut nulla scelerisque, placerat risus id, consectetur nisi. Mauris in dolor laoreet, tristique risus ut, accumsan lorem. Donec suscipit interdum ex, sit amet fringilla odio pellentesque id. Ut vel lacus ut dolor interdum elementum porttitor eget risus. Donec justo dolor, pellentesque ac aliquam sed, euismod id neque. Fusce imperdiet hendrerit congue. Praesent eget nulla eu sapien tempus fringilla. Morbi arcu enim, posuere nec ligula non, tristique tincidunt mauris. Sed sollicitudin ante in vestibulum scelerisque. Aliquam et rutrum arcu, at convallis nisi. Donec sit amet lorem nec ante sagittis pharetra vel a mauris. Aenean ullamcorper massa id elit laoreet, non scelerisque ex sodales. Aliquam porttitor justo massa, sed interdum massa ultrices at. "
                }
            },
            {
                title: "Thriller",
                artist: "Michael Jackson",
                cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23800080'/%3E%3Ccircle cx='75' cy='75' r='45' fill='%23FFD700'/%3E%3Ctext x='75' y='78' text-anchor='middle' font-family='Arial' font-size='12' fill='%23800080' font-weight='bold'%3EThriller%3C/text%3E%3C/svg%3E",
                tracks: [
                    { name: "Wanna Be Startin' Somethin'", time: "6:02", genre: "Pop" },
                    { name: "Baby Be Mine", time: "4:20", genre: "Pop" },
                    { name: "The Girl Is Mine", time: "3:42", genre: "Pop" },
                    { name: "Thriller", time: "5:57", genre: "Pop" },
                    { name: "Beat It", time: "4:18", genre: "Rock" }
                ]
            },
            {
                title: "Back in Black",
                artist: "AC/DC",
                cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23000'/%3E%3Ctext x='75' y='67' text-anchor='middle' font-family='Arial' font-size='16' fill='%23FFF' font-weight='bold'%3EBACK IN%3C/text%3E%3Ctext x='75' y='90' text-anchor='middle' font-family='Arial' font-size='16' fill='%23FFF' font-weight='bold'%3EBLACK%3C/text%3E%3C/svg%3E",
                tracks: [
                    { name: "Hells Bells", time: "5:12", genre: "Hard Rock" },
                    { name: "Shoot to Thrill", time: "5:17", genre: "Hard Rock" },
                    { name: "What Do You Do for Money Honey", time: "3:35", genre: "Hard Rock" },
                    { name: "Given the Dog a Bone", time: "3:31", genre: "Hard Rock" },
                    { name: "Let Me Put My Love Into You", time: "4:16", genre: "Hard Rock" }
                ]
            },
            {
                title: "Hotel California",
                artist: "Eagles",
                cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23FF6B35'/%3E%3Crect x='37.5' y='60' width='75' height='30' fill='%23FFD23F'/%3E%3Ctext x='75' y='78' text-anchor='middle' font-family='Arial' font-size='10' fill='%238B4513'%3EHotel California%3C/text%3E%3C/svg%3E",
                tracks: [
                    { name: "Hotel California", time: "6:30", genre: "Rock" },
                    { name: "New Kid in Town", time: "5:04", genre: "Rock" },
                    { name: "Life in the Fast Lane", time: "4:46", genre: "Rock" },
                    { name: "Wasted Time", time: "4:55", genre: "Rock" }
                ]
            }
        ];