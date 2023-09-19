/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('playlist_song_activities', {
        id:{
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlist_id:{
            type: 'VARCHAR(50)',
            notNull: true,
        },
        song_id:{
            type: 'VARCHAR(50)',
            notNull: true,
        },
        user_id:{
            type: 'VARCHAR(50)',
            notNull: true,
        },
        action:{
            type: 'VARCHAR(100)',
            notNull: true,
        },
        time:{
            type: 'TEXT',
            notNull: true,
        },
    });

    
    // memberikan constraint foreign key pada kolom playlist songs activities
    pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropTable('playlist_song_activities');};
