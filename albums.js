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
                ]
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
                ]
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