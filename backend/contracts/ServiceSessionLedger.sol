// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ServiceSessionLedger {
    struct ServiceSession {
        uint256 sessionId;
        address provider;
        address client;
        string category;
        uint256 units;
        uint256 timestamp;
    }

    ServiceSession[] public sessions;
    mapping(uint256 => bool) public sessionLogged;
    address public owner;

    event ServiceLogged(
        uint256 indexed sessionId,
        address indexed provider,
        address indexed client,
        string category,
        uint256 units,
        uint256 timestamp
    );

    constructor() {
        owner = msg.sender;
    }

    function logService(
        uint256 _sessionId,
        address _provider,
        address _client,
        string memory _category,
        uint256 _units
    ) public {
        require(!sessionLogged[_sessionId], "Service already logged");
        require(msg.sender == owner, "Only owner can log services");

        ServiceSession memory s = ServiceSession({
            sessionId: _sessionId,
            provider: _provider,
            client: _client,
            category: _category,
            units: _units,
            timestamp: block.timestamp
        });

        sessions.push(s);
        sessionLogged[_sessionId] = true;

        emit ServiceLogged(
            _sessionId,
            _provider,
            _client,
            _category,
            _units,
            block.timestamp
        );
    }

    function getSessionsCount() public view returns (uint256) {
        return sessions.length;
    }

    function getSession(uint256 index) public view returns (
        uint256,
        address,
        address,
        string memory,
        uint256,
        uint256
    ) {
        require(index < sessions.length, "Index out of bounds");
        ServiceSession memory s = sessions[index];
        return (s.sessionId, s.provider, s.client, s.category, s.units, s.timestamp);
    }

    function getSessionsByAddress(address _address) public view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < sessions.length; i++) {
            if (sessions[i].provider == _address || sessions[i].client == _address) {
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < sessions.length; i++) {
            if (sessions[i].provider == _address || sessions[i].client == _address) {
                result[index] = i;
                index++;
            }
        }
        return result;
    }
}